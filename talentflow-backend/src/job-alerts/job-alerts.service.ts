import { Injectable, NotFoundException, ForbiddenException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { ResendEmailProvider } from '../auth/providers/resend-email.provider';

@Injectable()
export class JobAlertsService {
  private readonly logger = new Logger(JobAlertsService.name);

  constructor(
    private prisma: PrismaService,
    private notificationsService: NotificationsService,
    private emailProvider: ResendEmailProvider,
  ) {}

  async create(userId: string, data: { name: string; queryJson: any; frequency?: any; savedSearchId?: string }) {
    const candidate = await this.prisma.candidateProfile.findUnique({ where: { userId } });
    if (!candidate) {
      throw new ForbiddenException('Candidate profile required to create job alerts');
    }

    return this.prisma.jobAlert.create({
      data: {
        candidateId: candidate.id,
        savedSearchId: data.savedSearchId || null,
        name: data.name,
        queryJson: data.queryJson || {},
        frequency: data.frequency || 'DAILY',
      },
    });
  }

  async findAllForCandidate(userId: string) {
    const candidate = await this.prisma.candidateProfile.findUnique({ where: { userId } });
    if (!candidate) return [];

    return this.prisma.jobAlert.findMany({
      where: { candidateId: candidate.id },
      include: { savedSearch: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async remove(id: string, userId: string) {
    const candidate = await this.prisma.candidateProfile.findUnique({ where: { userId } });
    if (!candidate) throw new ForbiddenException('Candidate profile required');

    const alert = await this.prisma.jobAlert.findUnique({ where: { id } });
    if (!alert) throw new NotFoundException('Job alert not found');

    if (alert.candidateId !== candidate.id) {
      throw new ForbiddenException('Unauthorized access to job alert');
    }

    return this.prisma.jobAlert.delete({ where: { id } });
  }

  /**
   * Alert Execution Engine (Run periodically by scheduler or manually)
   */
  async processJobAlerts() {
    this.logger.log('Starting Job Alert execution cycle...');
    const activeAlerts = await this.prisma.jobAlert.findMany({
      where: { isActive: true },
      include: { candidate: { include: { user: true } } },
    });

    let totalNotificationsSent = 0;

    for (const alert of activeAlerts) {
      try {
        const query: any = alert.queryJson || {};
        const where: any = {
          deletedAt: null,
          status: { in: ['PUBLISHED', 'ACTIVE', 'OPEN'] },
        };

        if (query.q) {
          where.title = { contains: query.q, mode: 'insensitive' };
        }
        if (query.location) {
          where.location = { contains: query.location, mode: 'insensitive' };
        }

        const eligibleJobs = await this.prisma.job.findMany({
          where,
          take: 10,
          orderBy: { createdAt: 'desc' },
        });

        // Filter out jobs already delivered to this alert
        const deliveredIds = (
          await this.prisma.jobAlertDelivery.findMany({
            where: { jobAlertId: alert.id },
            select: { jobId: true },
          })
        ).map((d) => d.jobId);

        const newJobs = eligibleJobs.filter((j) => !deliveredIds.includes(j.id));

        if (newJobs.length > 0) {
          // Record delivery to prevent spam
          await this.prisma.jobAlertDelivery.createMany({
            data: newJobs.map((j) => ({
              jobAlertId: alert.id,
              jobId: j.id,
            })),
            skipDuplicates: true,
          });

          // Dispatch in-app notification
          if (alert.candidate?.userId) {
            await this.notificationsService.create({
              userId: alert.candidate.userId,
              title: `Job Alert: ${newJobs.length} new matching job(s)`,
              message: `${newJobs.length} new position(s) match your saved search '${alert.name}'.`,
            });
            totalNotificationsSent++;
          }

          // Update lastRunAt
          await this.prisma.jobAlert.update({
            where: { id: alert.id },
            data: { lastRunAt: new Date() },
          });
        }
      } catch (err) {
        this.logger.error(`Error processing job alert ${alert.id}: ${err}`);
      }
    }

    return { processed: activeAlerts.length, notificationsSent: totalNotificationsSent };
  }
}

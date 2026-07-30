import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationDto } from './dto/update-application.dto';
import { NotificationsService } from '../notifications/notifications.service';
import { ApplicationStatus } from '@prisma/client';
import { isValidTransition } from './state-machine';

@Injectable()
export class ApplicationsService {
  constructor(
    private prisma: PrismaService,
    private notificationsService: NotificationsService,
  ) {}

  async create(createApplicationDto: CreateApplicationDto) {
    const { candidateId, jobId } = createApplicationDto;

    const candidateSkills = await this.prisma.candidateSkill.findMany({
      where: { candidateId },
    });
    const jobSkills = await this.prisma.jobSkill.findMany({ where: { jobId } });

    let matchScore = 100;
    if (jobSkills.length > 0) {
      let matched = 0;
      for (const reqSkill of jobSkills) {
        if (candidateSkills.some((cs) => cs.skillId === reqSkill.skillId)) {
          matched++;
        }
      }
      matchScore = Math.round((matched / jobSkills.length) * 100);
    }

    const application = await this.prisma.application.create({
      data: {
        ...createApplicationDto,
        matchScore,
        status: ApplicationStatus.APPLIED,
      },
    });

    // Create baseline status history entry
    try {
      const candidate = await this.prisma.candidateProfile.findUnique({
        where: { id: candidateId },
      });
      if (candidate) {
        await this.prisma.applicationStatusHistory.create({
          data: {
            applicationId: application.id,
            fromStatus: ApplicationStatus.APPLIED,
            toStatus: ApplicationStatus.APPLIED,
            changedByUserId: candidate.userId,
            changedByRole: 'CANDIDATE',
            reason: 'Application submitted',
          },
        });
      }
    } catch (e) {
      console.warn('Failed to record baseline status history:', e);
    }

    // Non-blocking notification & email trigger
    await this.notificationsService.notifyApplicationSubmitted(application.id);

    return application;
  }

  async findAll(filters: any) {
    const where: any = {};
    if (filters.candidateId) where.candidateId = filters.candidateId;
    if (filters.jobId) where.jobId = filters.jobId;
    if (filters.employerId) where.job = { employerId: filters.employerId };
    if (filters.status) where.status = filters.status;

    const page = Number(filters.page) || 1;
    const limit = Number(filters.limit) || 20;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.prisma.application.findMany({
        where,
        include: {
          candidate: true,
          job: { include: { employer: true } },
          statusHistory: { orderBy: { createdAt: 'desc' } },
          tags: { include: { tag: true } },
        },
        orderBy: { appliedAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.application.count({ where }),
    ]);

    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findOne(id: string, user?: any) {
    const application = await this.prisma.application.findUnique({
      where: { id },
      include: {
        candidate: true,
        job: { include: { employer: true } },
        interviews: true,
        statusHistory: {
          orderBy: { createdAt: 'asc' },
          include: { user: { select: { id: true, email: true } } },
        },
        notes: {
          orderBy: { createdAt: 'desc' },
        },
        tags: { include: { tag: true } },
      },
    });

    if (!application) throw new NotFoundException('Application not found');

    if (user && user.role !== 'ADMIN') {
      const userId = user.sub || user.userId;
      const isCandidate = application.candidate.userId === userId;
      const isEmployer = application.job.employer.userId === userId;
      if (!isCandidate && !isEmployer) throw new ForbiddenException('Forbidden');

      // Hide private employer notes and tags from candidate
      if (isCandidate) {
        (application as any).notes = [];
        (application as any).tags = [];
      }
    }

    return application;
  }

  async update(id: string, updateApplicationDto: UpdateApplicationDto, user?: any) {
    const application = await this.prisma.application.findUnique({
      where: { id },
      include: { candidate: true, job: { include: { employer: true } } },
    });
    if (!application) throw new NotFoundException('Application not found');

    if (user && user.role !== 'ADMIN') {
      const userId = user.sub || user.userId;
      const isCandidate = application.candidate.userId === userId;
      const isEmployer = application.job.employer.userId === userId;
      if (!isCandidate && !isEmployer) throw new ForbiddenException('Forbidden');
    }

    const updated = await this.prisma.application.update({
      where: { id },
      data: updateApplicationDto,
    });

    return updated;
  }

  async remove(id: string, user?: any) {
    const application = await this.prisma.application.findUnique({
      where: { id },
      include: { candidate: true, job: { include: { employer: true } } },
    });
    if (!application) throw new NotFoundException('Application not found');
    if (user && user.role !== 'ADMIN') {
      const userId = user.sub || user.userId;
      const isCandidate = application.candidate.userId === userId;
      const isEmployer = application.job.employer.userId === userId;
      if (!isCandidate && !isEmployer) throw new ForbiddenException('Forbidden');
    }
    await this.prisma.application.delete({ where: { id } });
    return { success: true };
  }

  async findEmployerApplications(userId: string) {
    const employer = await this.prisma.employerProfile.findUnique({
      where: { userId },
    });
    if (!employer) {
      throw new NotFoundException('Employer profile not found');
    }

    const page = 1;
    const limit = 50;
    const skip = 0;

    const [data, total] = await Promise.all([
      this.prisma.application.findMany({
        where: { job: { employerId: employer.id } },
        include: {
          candidate: true,
          job: { include: { employer: true } },
          statusHistory: { orderBy: { createdAt: 'desc' } },
          notes: { orderBy: { createdAt: 'desc' } },
          tags: { include: { tag: true } },
          interviews: true,
        },
        orderBy: { appliedAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.application.count({
        where: { job: { employerId: employer.id } },
      }),
    ]);

    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async updateStatus(id: string, status: string, user: any, reason?: string) {
    const targetStatus = status as ApplicationStatus;
    const userId = user.sub || user.userId;

    const application = await this.prisma.application.findUnique({
      where: { id },
      include: { job: { include: { employer: true } }, candidate: true },
    });

    if (!application) {
      throw new NotFoundException('Application not found');
    }

    if (user.role !== 'ADMIN') {
      if (user.role !== 'EMPLOYER' || !application.job?.employer || application.job.employer.userId !== userId) {
        throw new ForbiddenException('Forbidden: Cannot modify applications for other employers');
      }
    }

    // Validate state transition
    if (!isValidTransition(application.status, targetStatus)) {
      throw new BadRequestException(
        `Invalid status transition from ${application.status} to ${targetStatus}`,
      );
    }

    const fromStatus = application.status;

    // Execute state update & history creation transactionally
    const updated = await this.prisma.application.update({
      where: { id },
      data: { status: targetStatus },
    });

    await this.prisma.applicationStatusHistory.create({
      data: {
        applicationId: id,
        fromStatus,
        toStatus: targetStatus,
        changedByUserId: userId,
        changedByRole: user.role,
        reason: reason || `Status changed to ${targetStatus}`,
      },
    });

    // Create Audit Log
    try {
      await this.prisma.auditLog.create({
        data: {
          actionBy: userId,
          action: 'APPLICATION_STATUS_CHANGE',
          resource: `Application:${id}`,
          details: { applicationId: id, fromStatus, toStatus: targetStatus },
        },
      });
    } catch (e) {
      console.warn('AuditLog creation error:', e);
    }

    // Trigger Notification & Email
    if (['SHORTLISTED', 'INTERVIEWING', 'OFFERED', 'HIRED', 'REJECTED'].includes(targetStatus)) {
      await this.notificationsService.notifyApplicationStatusChanged(id, targetStatus);
    }

    return updated;
  }

  async withdraw(id: string, user: any, reason?: string) {
    const userId = user.sub || user.userId;

    const application = await this.prisma.application.findUnique({
      where: { id },
      include: { candidate: true, job: { include: { employer: true } } },
    });

    if (!application) {
      throw new NotFoundException('Application not found');
    }

    if (user.role !== 'ADMIN' && application.candidate.userId !== userId) {
      throw new ForbiddenException('Forbidden: You can only withdraw your own applications');
    }

    if (['HIRED', 'REJECTED', 'WITHDRAWN'].includes(application.status as any)) {
      throw new BadRequestException(`Cannot withdraw application in terminal state: ${application.status}`);
    }

    const fromStatus = application.status;
    const targetStatus = ApplicationStatus.WITHDRAWN;

    const updated = await this.prisma.application.update({
      where: { id },
      data: { status: targetStatus },
    });

    await this.prisma.applicationStatusHistory.create({
      data: {
        applicationId: id,
        fromStatus,
        toStatus: targetStatus,
        changedByUserId: userId,
        changedByRole: 'CANDIDATE',
        reason: reason || 'Withdrawn by candidate',
      },
    });

    // Notify Employer
    try {
      await this.notificationsService.create({
        userId: application.job.employer.userId,
        title: 'Application Withdrawn',
        message: `Candidate withdrew application for ${application.job.title}`,
      });
    } catch (e) {
      console.warn('Notification trigger error on withdraw:', e);
    }

    return updated;
  }

  async getStatusHistory(id: string, user: any) {
    const application = await this.prisma.application.findUnique({
      where: { id },
      include: { candidate: true, job: { include: { employer: true } } },
    });

    if (!application) throw new NotFoundException('Application not found');

    if (user.role !== 'ADMIN') {
      const userId = user.sub || user.userId;
      const isCandidate = application.candidate.userId === userId;
      const isEmployer = application.job.employer.userId === userId;
      if (!isCandidate && !isEmployer) throw new ForbiddenException('Forbidden');
    }

    return this.prisma.applicationStatusHistory.findMany({
      where: { applicationId: id },
      orderBy: { createdAt: 'asc' },
      include: { user: { select: { id: true, email: true } } },
    });
  }

  async getEmployerPipeline(user: any, query: any) {
    const userId = user.sub || user.userId;
    const employer = await this.prisma.employerProfile.findUnique({
      where: { userId },
    });
    if (!employer) throw new NotFoundException('Employer profile not found');

    const where: any = { job: { employerId: employer.id } };

    if (query.jobId) where.jobId = query.jobId;
    if (query.status) where.status = query.status;
    if (query.search) {
      where.OR = [
        { candidate: { bio: { contains: query.search, mode: 'insensitive' } } },
        { candidate: { user: { email: { contains: query.search, mode: 'insensitive' } } } },
      ];
    }
    if (query.tagId) {
      where.tags = { some: { tagId: query.tagId } };
    }

    const applications = await this.prisma.application.findMany({
      where,
      include: {
        candidate: { include: { user: { select: { email: true } } } },
        job: true,
        notes: { orderBy: { createdAt: 'desc' } },
        tags: { include: { tag: true } },
        interviews: true,
      },
      orderBy: { appliedAt: 'desc' },
    });

    // Group by status
    const pipeline: Record<string, any[]> = {
      APPLIED: [],
      PENDING: [],
      SHORTLISTED: [],
      INTERVIEWING: [],
      OFFERED: [],
      HIRED: [],
      REJECTED: [],
      WITHDRAWN: [],
    };

    for (const app of applications) {
      if (pipeline[app.status]) {
        pipeline[app.status].push(app);
      } else {
        pipeline[app.status] = [app];
      }
    }

    const counts = {
      applied: (pipeline.APPLIED?.length || 0) + (pipeline.PENDING?.length || 0),
      shortlisted: pipeline.SHORTLISTED?.length || 0,
      interviewing: pipeline.INTERVIEWING?.length || 0,
      offered: pipeline.OFFERED?.length || 0,
      hired: pipeline.HIRED?.length || 0,
      rejected: pipeline.REJECTED?.length || 0,
      withdrawn: pipeline.WITHDRAWN?.length || 0,
      total: applications.length,
    };

    return { pipeline, counts };
  }

  async getEmployerAnalytics(user: any) {
    const userId = user.sub || user.userId;
    const employer = await this.prisma.employerProfile.findUnique({
      where: { userId },
    });
    if (!employer) throw new NotFoundException('Employer profile not found');

    const applications = await this.prisma.application.findMany({
      where: { job: { employerId: employer.id } },
      select: { status: true },
    });

    const total = applications.length;
    const applied = applications.filter((a) => a.status === 'APPLIED' || a.status === 'PENDING').length;
    const shortlisted = applications.filter((a) => a.status === 'SHORTLISTED').length;
    const interviewing = applications.filter((a) => a.status === 'INTERVIEWING').length;
    const offered = applications.filter((a) => a.status === 'OFFERED').length;
    const hired = applications.filter((a) => a.status === 'HIRED').length;

    const conversionRates = {
      appliedToShortlist: applied > 0 ? Math.round((shortlisted / applied) * 100) : 0,
      shortlistToInterview: shortlisted > 0 ? Math.round((interviewing / shortlisted) * 100) : 0,
      interviewToOffer: interviewing > 0 ? Math.round((offered / interviewing) * 100) : 0,
      offerToHire: offered > 0 ? Math.round((hired / offered) * 100) : 0,
    };

    return {
      total,
      applied,
      shortlisted,
      interviewing,
      offered,
      hired,
      conversionRates,
    };
  }

  // Employer Private Candidate Notes
  async createNote(applicationId: string, content: string, user: any) {
    const userId = user.sub || user.userId;
    const employer = await this.prisma.employerProfile.findUnique({ where: { userId } });
    if (!employer) throw new NotFoundException('Employer profile not found');

    const application = await this.prisma.application.findUnique({
      where: { id: applicationId },
      include: { job: true },
    });

    if (!application || application.job.employerId !== employer.id) {
      throw new ForbiddenException('Forbidden: Cannot add notes to other employers applications');
    }

    if (!content || !content.trim()) {
      throw new BadRequestException('Note content cannot be empty');
    }

    return this.prisma.employerCandidateNote.create({
      data: {
        applicationId,
        employerId: employer.id,
        content: content.trim(),
      },
    });
  }

  async getNotes(applicationId: string, user: any) {
    const userId = user.sub || user.userId;
    const employer = await this.prisma.employerProfile.findUnique({ where: { userId } });
    if (!employer) throw new ForbiddenException('Forbidden: Employer access required for notes');

    const application = await this.prisma.application.findUnique({
      where: { id: applicationId },
      include: { job: true },
    });

    if (!application || application.job.employerId !== employer.id) {
      throw new ForbiddenException('Forbidden: Cannot access notes for other employers applications');
    }

    return this.prisma.employerCandidateNote.findMany({
      where: { applicationId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async deleteNote(noteId: string, user: any) {
    const userId = user.sub || user.userId;
    const employer = await this.prisma.employerProfile.findUnique({ where: { userId } });
    if (!employer) throw new ForbiddenException('Forbidden');

    const note = await this.prisma.employerCandidateNote.findUnique({ where: { id: noteId } });
    if (!note || note.employerId !== employer.id) {
      throw new ForbiddenException('Forbidden');
    }

    await this.prisma.employerCandidateNote.delete({ where: { id: noteId } });
    return { success: true };
  }

  // Candidate Tags
  async createTag(name: string, color: string, user: any) {
    const userId = user.sub || user.userId;
    const employer = await this.prisma.employerProfile.findUnique({ where: { userId } });
    if (!employer) throw new NotFoundException('Employer profile not found');

    if (!name || !name.trim()) throw new BadRequestException('Tag name required');

    return this.prisma.candidateTag.upsert({
      where: { employerId_name: { employerId: employer.id, name: name.trim() } },
      create: { employerId: employer.id, name: name.trim(), color: color || 'blue' },
      update: { color: color || 'blue' },
    });
  }

  async getTags(user: any) {
    const userId = user.sub || user.userId;
    const employer = await this.prisma.employerProfile.findUnique({ where: { userId } });
    if (!employer) throw new ForbiddenException('Employer profile required');

    return this.prisma.candidateTag.findMany({
      where: { employerId: employer.id },
      orderBy: { name: 'asc' },
    });
  }

  async assignTag(applicationId: string, tagId: string, user: any) {
    const userId = user.sub || user.userId;
    const employer = await this.prisma.employerProfile.findUnique({ where: { userId } });
    if (!employer) throw new ForbiddenException('Employer profile required');

    const application = await this.prisma.application.findUnique({
      where: { id: applicationId },
      include: { job: true },
    });
    if (!application || application.job.employerId !== employer.id) {
      throw new ForbiddenException('Forbidden');
    }

    return this.prisma.applicationTagAssignment.upsert({
      where: { applicationId_tagId: { applicationId, tagId } },
      create: { applicationId, tagId },
      update: {},
    });
  }

  async removeTag(applicationId: string, tagId: string, user: any) {
    const userId = user.sub || user.userId;
    const employer = await this.prisma.employerProfile.findUnique({ where: { userId } });
    if (!employer) throw new ForbiddenException('Employer profile required');

    const application = await this.prisma.application.findUnique({
      where: { id: applicationId },
      include: { job: true },
    });
    if (!application || application.job.employerId !== employer.id) {
      throw new ForbiddenException('Forbidden');
    }

    await this.prisma.applicationTagAssignment.deleteMany({
      where: { applicationId, tagId },
    });
    return { success: true };
  }
}

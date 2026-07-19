import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateInterviewDto } from './dto/create-interview.dto';
import { UpdateInterviewDto } from './dto/update-interview.dto';
import { InterviewStatus } from '@prisma/client';
import { AuditLogsService } from '../audit-logs/audit-logs.service';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class InterviewsService {
  constructor(
    private prisma: PrismaService,
    private auditLogsService: AuditLogsService,
    private notificationsService: NotificationsService,
  ) {}

  private async checkOverlap(
    employerId: string,
    candidateId: string,
    start: Date,
    durationMins: number,
    excludeInterviewId?: string,
  ) {
    const end = new Date(start.getTime() + durationMins * 60000);
    const activeInterviews = await this.prisma.interview.findMany({
      where: {
        OR: [{ employerId }, { candidateId }],
        status: 'SCHEDULED',
        scheduledAt: { gte: new Date(new Date().setHours(0, 0, 0, 0)) },
        ...(excludeInterviewId ? { id: { not: excludeInterviewId } } : {}),
      },
    });

    for (const iv of activeInterviews) {
      const ivStart = iv.scheduledAt;
      const ivEnd = new Date(ivStart.getTime() + iv.duration * 60000);
      if (start < ivEnd && end > ivStart) {
        if (iv.employerId === employerId)
          throw new ConflictException(
            'You have an overlapping interview scheduled at this time',
          );
        if (iv.candidateId === candidateId)
          throw new ConflictException(
            'The candidate has an overlapping interview scheduled at this time',
          );
      }
    }
  }

  async schedule(createInterviewDto: CreateInterviewDto, userId: string) {
    const employerProfile = await this.prisma.employerProfile.findUnique({
      where: { userId },
    });
    if (!employerProfile)
      throw new NotFoundException('Employer profile not found');

    const application = await this.prisma.application.findUnique({
      where: { id: createInterviewDto.applicationId },
      include: { job: true, candidate: { include: { user: true } } },
    });
    if (!application) throw new NotFoundException('Application not found');
    if (application.job.employerId !== employerProfile.id)
      throw new ForbiddenException('You do not own this application');

    const scheduledAt = new Date(createInterviewDto.scheduledAt);
    if (scheduledAt < new Date())
      throw new BadRequestException('Cannot schedule an interview in the past');

    const existingForApp = await this.prisma.interview.findFirst({
      where: { applicationId: application.id, status: { in: ['SCHEDULED'] } },
    });
    if (existingForApp)
      throw new ConflictException(
        'Application already has an active scheduled interview',
      );

    await this.checkOverlap(
      employerProfile.id,
      application.candidateId,
      scheduledAt,
      createInterviewDto.duration || 60,
    );

    const interview = await this.prisma.interview.create({
      data: {
        ...createInterviewDto,
        employerId: employerProfile.id,
        candidateId: application.candidateId,
      },
    });

    if (['PENDING', 'REVIEWING', 'SHORTLISTED'].includes(application.status)) {
      await this.prisma.application.update({
        where: { id: application.id },
        data: { status: 'INTERVIEWING' },
      });
    }

    await this.auditLogsService.create({
      actionBy: userId,
      action: 'INTERVIEW_SCHEDULED',
      resource: interview.id,
    });
    await this.notificationsService.create({
      userId: application.candidate.userId,
      title: 'Interview Scheduled',
      message: `An interview has been scheduled for your application to ${application.job.title}`,
    });

    return interview;
  }

  async findAllByEmployer(userId: string) {
    const employerProfile = await this.prisma.employerProfile.findUnique({
      where: { userId },
    });
    if (!employerProfile) return [];
    return this.prisma.interview.findMany({
      where: { employerId: employerProfile.id },
      include: {
        candidate: {
          include: { user: { select: { email: true, avatarUrl: true } } },
        },
        application: { include: { job: { select: { title: true } } } },
      },
      orderBy: { scheduledAt: 'asc' },
    });
  }

  async findAllByCandidate(userId: string) {
    const candidateProfile = await this.prisma.candidateProfile.findUnique({
      where: { userId },
    });
    if (!candidateProfile) return [];
    return this.prisma.interview.findMany({
      where: { candidateId: candidateProfile.id },
      include: {
        employer: {
          include: { user: { select: { email: true, avatarUrl: true } } },
        },
        application: { include: { job: { select: { title: true } } } },
      },
      orderBy: { scheduledAt: 'asc' },
    });
  }

  async findOne(id: string, userId: string, role: string) {
    const interview = await this.prisma.interview.findUnique({
      where: { id },
      include: {
        candidate: { include: { user: true } },
        employer: { include: { user: true } },
        application: { include: { job: true } },
      },
    });
    if (!interview) throw new NotFoundException('Interview not found');

    if (role === 'EMPLOYER' && interview.employer.userId !== userId)
      throw new ForbiddenException('You do not own this interview');
    if (role === 'CANDIDATE' && interview.candidate.userId !== userId)
      throw new ForbiddenException('You do not own this interview');

    return interview;
  }

  async reschedule(
    id: string,
    updateInterviewDto: UpdateInterviewDto,
    userId: string,
  ) {
    const interview = await this.findOne(id, userId, 'EMPLOYER');

    if (updateInterviewDto.scheduledAt) {
      const scheduledAt = new Date(updateInterviewDto.scheduledAt);
      if (scheduledAt < new Date())
        throw new BadRequestException(
          'Cannot schedule an interview in the past',
        );
      await this.checkOverlap(
        interview.employerId,
        interview.candidateId,
        scheduledAt,
        updateInterviewDto.duration || interview.duration,
        interview.id,
      );
    }

    const updated = await this.prisma.interview.update({
      where: { id },
      data: {
        scheduledAt: updateInterviewDto.scheduledAt,
        duration: updateInterviewDto.duration,
        meetingUrl: updateInterviewDto.meetingUrl,
        meetingProvider: updateInterviewDto.meetingProvider,
        notes: updateInterviewDto.notes,
        status: 'SCHEDULED',
      },
    });

    await this.auditLogsService.create({
      actionBy: userId,
      action: 'INTERVIEW_RESCHEDULED',
      resource: id,
    });
    await this.notificationsService.create({
      userId: interview.candidate.userId,
      title: 'Interview Rescheduled',
      message: `Your interview for ${interview.application.job.title} has been rescheduled.`,
    });

    return updated;
  }

  async cancel(id: string, userId: string, role: string) {
    const interview = await this.findOne(id, userId, role);
    const updated = await this.prisma.interview.update({
      where: { id },
      data: { status: 'CANCELLED' },
    });

    await this.auditLogsService.create({
      actionBy: userId,
      action: 'INTERVIEW_CANCELLED',
      resource: id,
    });

    const notifyUserId =
      role === 'EMPLOYER'
        ? interview.candidate.userId
        : interview.employer.userId;
    const notifierRole = role === 'EMPLOYER' ? 'Employer' : 'Candidate';
    await this.notificationsService.create({
      userId: notifyUserId,
      title: 'Interview Cancelled',
      message: `The ${notifierRole} has cancelled the interview for ${interview.application.job.title}.`,
    });

    return updated;
  }

  async complete(id: string, feedback: string | undefined, userId: string) {
    const interview = await this.findOne(id, userId, 'EMPLOYER');
    const updated = await this.prisma.interview.update({
      where: { id },
      data: { status: 'COMPLETED', feedback },
    });
    await this.auditLogsService.create({
      actionBy: userId,
      action: 'INTERVIEW_COMPLETED',
      resource: id,
    });
    return updated;
  }

  async markNoShow(id: string, userId: string) {
    const interview = await this.findOne(id, userId, 'EMPLOYER');
    const updated = await this.prisma.interview.update({
      where: { id },
      data: { status: 'NO_SHOW' },
    });
    await this.auditLogsService.create({
      actionBy: userId,
      action: 'INTERVIEW_NO_SHOW',
      resource: id,
    });
    return updated;
  }

  async remove(id: string, userId: string, role: string) {
    if (role !== 'ADMIN') await this.findOne(id, userId, role); // Only admin can delete indiscriminately, else must own it. Wait, the controller says EMPLOYER or ADMIN. Let's assume ADMIN can delete anything, Employer must own it.
    return this.prisma.interview.delete({ where: { id } });
  }
}

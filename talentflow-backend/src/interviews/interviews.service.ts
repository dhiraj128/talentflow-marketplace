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
import { CreateInterviewFeedbackDto } from './dto/create-feedback.dto';
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
        createdByUserId: userId,
      },
    });

    if (['PENDING', 'REVIEWING', 'SHORTLISTED'].includes(application.status)) {
      const prevStatus = application.status;
      await this.prisma.application.update({
        where: { id: application.id },
        data: { status: 'INTERVIEWING' },
      });
      await this.prisma.applicationStatusHistory.create({
        data: {
          applicationId: application.id,
          fromStatus: prevStatus,
          toStatus: 'INTERVIEWING',
          changedByUserId: userId,
          changedByRole: 'EMPLOYER',
          reason: 'Interview scheduled',
        },
      });
    }

    await this.auditLogsService.create({
      actionBy: userId,
      action: 'INTERVIEW_SCHEDULED',
      resource: interview.id,
    });

    await this.notificationsService.notifyInterviewEvent(interview.id, 'SCHEDULED');

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
        feedbackList: true,
      },
      orderBy: { scheduledAt: 'asc' },
    });
  }

  async findAllByCandidate(userId: string) {
    const candidateProfile = await this.prisma.candidateProfile.findUnique({
      where: { userId },
    });
    if (!candidateProfile) return [];

    const interviews = await this.prisma.interview.findMany({
      where: { candidateId: candidateProfile.id },
      include: {
        employer: {
          include: { user: { select: { email: true, avatarUrl: true } } },
        },
        application: { include: { job: { select: { title: true } } } },
      },
      orderBy: { scheduledAt: 'asc' },
    });

    // PRIVACY ENFORCEMENT: Remove employer private notes and feedback for Candidate
    return interviews.map((iv) => ({
      ...iv,
      notes: null,
      feedback: null,
    }));
  }

  async findOne(id: string, userId: string, role: string) {
    const interview = await this.prisma.interview.findUnique({
      where: { id },
      include: {
        candidate: { include: { user: true } },
        employer: { include: { user: true } },
        application: { include: { job: true } },
        feedbackList: role === 'EMPLOYER' || role === 'ADMIN',
      },
    });
    if (!interview) throw new NotFoundException('Interview not found');

    if (role === 'EMPLOYER' && interview.employer.userId !== userId)
      throw new ForbiddenException('You do not own this interview');
    if (role === 'CANDIDATE' && interview.candidate.userId !== userId)
      throw new ForbiddenException('You do not own this interview');

    if (role === 'CANDIDATE') {
      return {
        ...interview,
        notes: null,
        feedback: null,
      };
    }

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
        type: updateInterviewDto.type || interview.type,
        duration: updateInterviewDto.duration || interview.duration,
        meetingUrl: updateInterviewDto.meetingUrl || interview.meetingUrl,
        meetingProvider: updateInterviewDto.meetingProvider || interview.meetingProvider,
        location: updateInterviewDto.location || interview.location,
        instructions: updateInterviewDto.instructions || interview.instructions,
        notes: updateInterviewDto.notes || interview.notes,
        status: 'RESCHEDULED',
      },
    });

    await this.auditLogsService.create({
      actionBy: userId,
      action: 'INTERVIEW_RESCHEDULED',
      resource: id,
    });

    await this.notificationsService.notifyInterviewEvent(id, 'RESCHEDULED');

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

    await this.notificationsService.notifyInterviewEvent(id, 'CANCELLED');

    return updated;
  }

  async complete(id: string, feedbackNotes: string | undefined, userId: string) {
    const interview = await this.findOne(id, userId, 'EMPLOYER');
    const updated = await this.prisma.interview.update({
      where: { id },
      data: { status: 'COMPLETED', feedback: feedbackNotes },
    });
    await this.auditLogsService.create({
      actionBy: userId,
      action: 'INTERVIEW_COMPLETED',
      resource: id,
    });
    return updated;
  }

  async submitFeedback(
    id: string,
    dto: CreateInterviewFeedbackDto,
    userId: string,
  ) {
    const interview = await this.findOne(id, userId, 'EMPLOYER');
    const feedback = await this.prisma.interviewFeedback.create({
      data: {
        interviewId: id,
        employerUserId: userId,
        rating: dto.rating,
        recommendation: dto.recommendation,
        strengths: dto.strengths,
        concerns: dto.concerns,
        notes: dto.notes,
      },
    });

    await this.prisma.interview.update({
      where: { id },
      data: { status: 'COMPLETED' },
    });

    await this.auditLogsService.create({
      actionBy: userId,
      action: 'INTERVIEW_FEEDBACK_SUBMITTED',
      resource: id,
    });

    return feedback;
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
    if (role !== 'ADMIN') await this.findOne(id, userId, role);
    return this.prisma.interview.delete({ where: { id } });
  }
}

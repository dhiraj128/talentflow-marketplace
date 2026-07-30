import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { ResendEmailProvider } from '../auth/providers/resend-email.provider';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(
    private prisma: PrismaService,
    private emailProvider: ResendEmailProvider,
  ) {}

  async create(createNotificationDto: CreateNotificationDto) {
    return this.prisma.notification.create({ data: createNotificationDto });
  }

  findAll(filters: { userId?: string; skip?: number; take?: number }) {
    const where: any = {};
    if (filters.userId) where.userId = filters.userId;
    return this.prisma.notification.findMany({
      where,
      skip: filters.skip,
      take: filters.take,
      orderBy: { createdAt: 'desc' },
    });
  }

  findOne(id: string, user?: any) {
    return this.prisma.notification.findUnique({ where: { id } });
  }

  update(id: string, updateNotificationDto: UpdateNotificationDto, user?: any) {
    return this.prisma.notification.update({
      where: { id },
      data: updateNotificationDto,
    });
  }

  remove(id: string, user?: any) {
    return this.prisma.notification.delete({ where: { id } });
  }

  private getDisplayName(user: any): string {
    if (!user) return 'User';
    return (
      user.candidateProfile?.fullName ||
      user.employerProfile?.companyName ||
      user.freelancerProfile?.fullName ||
      user.email ||
      'User'
    );
  }

  // =========================================================================
  // TRANSACTIONAL NOTIFICATION & EMAIL DISPATCHERS
  // =========================================================================

  /**
   * 1. Candidate Application Submitted
   * Recipient: Employer / Job Owner
   */
  async notifyApplicationSubmitted(applicationId: string) {
    try {
      const application = await this.prisma.application.findUnique({
        where: { id: applicationId },
        include: {
          candidate: { include: { user: true } },
          job: { include: { employer: { include: { user: true } } } },
        },
      });

      if (!application || !application.job?.employer?.user) return;

      const employerUser = application.job.employer.user;
      const candidateName = application.candidate.fullName || this.getDisplayName(application.candidate.user);
      const employerName = application.job.employer.companyName || this.getDisplayName(employerUser);
      const jobTitle = application.job.title;

      // 1. Create In-App Notification Record
      await this.create({
        userId: employerUser.id,
        title: 'New Application Received',
        message: `${candidateName} applied for your job "${jobTitle}".`,
      });

      // 2. Dispatch Non-Blocking Transactional Email
      if (employerUser.email) {
        await this.emailProvider.sendTransactionalEmail({
          to: employerUser.email,
          recipientName: employerName,
          subject: `New Application for ${jobTitle}`,
          title: 'New Candidate Application Submitted',
          bodyParagraphs: [
            `A new application has been submitted for your job listing "${jobTitle}".`,
            `Candidate ${candidateName} is waiting for your review.`,
          ],
          details: [
            { label: 'Job Title', value: jobTitle },
            { label: 'Candidate Name', value: candidateName },
            { label: 'Application Date', value: new Date().toLocaleDateString('en-US', { dateStyle: 'medium' }) },
          ],
          ctaText: 'Review Applications',
          ctaUrl: 'https://sispl.shop/employer/applications',
        });
      }
    } catch (error: any) {
      this.logger.error(`[NOTIFY] Error handling notifyApplicationSubmitted: ${error.message}`);
    }
  }

  /**
   * 2 & 3. Application Status Changed (SHORTLISTED, INTERVIEWING)
   * Recipient: Candidate
   */
  async notifyApplicationStatusChanged(applicationId: string, status: string) {
    try {
      if (!['SHORTLISTED', 'INTERVIEWING'].includes(status)) return;

      const application = await this.prisma.application.findUnique({
        where: { id: applicationId },
        include: {
          candidate: { include: { user: true } },
          job: { include: { employer: true } },
        },
      });

      if (!application || !application.candidate?.user) return;

      const candidateUser = application.candidate.user;
      const candidateName = application.candidate.fullName || this.getDisplayName(candidateUser);
      const jobTitle = application.job.title;
      const companyName = application.job.employer?.companyName || 'The Employer';

      const isShortlisted = status === 'SHORTLISTED';
      const eventTitle = isShortlisted ? 'Application Shortlisted' : 'Interview Stage Started';
      const message = isShortlisted
        ? `Great news! Your application for "${jobTitle}" has been shortlisted by ${companyName}.`
        : `Your application for "${jobTitle}" has moved to the interviewing stage.`;

      // 1. Create In-App Notification Record
      await this.create({
        userId: candidateUser.id,
        title: eventTitle,
        message,
      });

      // 2. Dispatch Non-Blocking Transactional Email
      if (candidateUser.email) {
        await this.emailProvider.sendTransactionalEmail({
          to: candidateUser.email,
          recipientName: candidateName,
          subject: isShortlisted
            ? `Your Application for ${jobTitle} Has Been Shortlisted`
            : `Interview Stage Update for ${jobTitle}`,
          title: eventTitle,
          bodyParagraphs: [
            message,
            isShortlisted
              ? 'The employer was impressed with your profile and has shortlisted you for further evaluation.'
              : 'Please check your schedule and interviews dashboard for upcoming interview requests.',
          ],
          details: [
            { label: 'Job Title', value: jobTitle },
            { label: 'Company', value: companyName },
            { label: 'New Status', value: status },
          ],
          ctaText: isShortlisted ? 'View Applications' : 'View Interviews',
          ctaUrl: isShortlisted
            ? 'https://sispl.shop/job-seeker/applications'
            : 'https://sispl.shop/job-seeker/interviews',
        });
      }
    } catch (error: any) {
      this.logger.error(`[NOTIFY] Error handling notifyApplicationStatusChanged: ${error.message}`);
    }
  }

  /**
   * 4. Interview Scheduled / Rescheduled / Cancelled
   * Recipient: Affected Candidate and Employer
   */
  async notifyInterviewEvent(interviewId: string, eventType: 'SCHEDULED' | 'RESCHEDULED' | 'CANCELLED') {
    try {
      const interview = await this.prisma.interview.findUnique({
        where: { id: interviewId },
        include: {
          candidate: { include: { user: true } },
          employer: { include: { user: true } },
          application: { include: { job: true } },
        },
      });

      if (!interview) return;

      const jobTitle = interview.application.job.title;
      const formattedDate = new Date(interview.scheduledAt).toLocaleString('en-US', {
        dateStyle: 'full',
        timeStyle: 'short',
      });

      const titleMap = {
        SCHEDULED: 'Interview Scheduled',
        RESCHEDULED: 'Interview Rescheduled',
        CANCELLED: 'Interview Cancelled',
      };

      const eventTitle = titleMap[eventType];

      // A. Candidate Notification & Email
      if (interview.candidate?.user) {
        const candidateUser = interview.candidate.user;
        const candidateName = interview.candidate.fullName || this.getDisplayName(candidateUser);
        await this.create({
          userId: candidateUser.id,
          title: eventTitle,
          message: `Your interview for "${jobTitle}" has been ${eventType.toLowerCase()} for ${formattedDate}.`,
        });

        if (candidateUser.email) {
          await this.emailProvider.sendTransactionalEmail({
            to: candidateUser.email,
            recipientName: candidateName,
            subject: `Interview ${eventType.charAt(0) + eventType.slice(1).toLowerCase()}: ${jobTitle}`,
            title: eventTitle,
            bodyParagraphs: [
              `Your interview session for "${jobTitle}" is currently marked as ${eventType}.`,
            ],
            details: [
              { label: 'Job Position', value: jobTitle },
              { label: 'Date & Time', value: formattedDate },
              { label: 'Duration', value: `${interview.duration} minutes` },
              { label: 'Meeting Link', value: interview.meetingUrl || 'To be shared' },
            ],
            ctaText: 'View Candidate Dashboard',
            ctaUrl: 'https://sispl.shop/job-seeker/interviews',
          });
        }
      }

      // B. Employer Notification & Email
      if (interview.employer?.user) {
        const employerUser = interview.employer.user;
        const employerName = interview.employer.companyName || this.getDisplayName(employerUser);
        const candidateName = interview.candidate.fullName || this.getDisplayName(interview.candidate.user);

        await this.create({
          userId: employerUser.id,
          title: eventTitle,
          message: `Interview for position "${jobTitle}" with candidate is ${eventType.toLowerCase()} for ${formattedDate}.`,
        });

        if (employerUser.email) {
          await this.emailProvider.sendTransactionalEmail({
            to: employerUser.email,
            recipientName: employerName,
            subject: `Interview ${eventType.charAt(0) + eventType.slice(1).toLowerCase()}: ${jobTitle}`,
            title: eventTitle,
            bodyParagraphs: [
              `The interview session for job posting "${jobTitle}" has been ${eventType.toLowerCase()}.`,
            ],
            details: [
              { label: 'Job Position', value: jobTitle },
              { label: 'Candidate', value: candidateName },
              { label: 'Date & Time', value: formattedDate },
            ],
            ctaText: 'Manage Interviews',
            ctaUrl: 'https://sispl.shop/employer/interviews',
          });
        }
      }
    } catch (error: any) {
      this.logger.error(`[NOTIFY] Error handling notifyInterviewEvent: ${error.message}`);
    }
  }

  /**
   * 5. Admin Job Approval / Rejection
   * Recipient: Employer / Job Owner
   */
  async notifyJobModeration(jobId: string, status: 'PUBLISHED' | 'REJECTED' | 'APPROVED' | 'CLOSED') {
    try {
      const job = await this.prisma.job.findUnique({
        where: { id: jobId },
        include: { employer: { include: { user: true } } },
      });

      if (!job || !job.employer?.user) return;

      const employerUser = job.employer.user;
      const employerName = job.employer.companyName || this.getDisplayName(employerUser);
      const isApproved = status === 'PUBLISHED' || status === 'APPROVED';
      const eventTitle = isApproved ? 'Job Posting Approved' : 'Job Posting Rejected';
      const statusText = isApproved ? 'approved and published' : 'rejected by moderation';

      // 1. Create In-App Notification Record
      await this.create({
        userId: employerUser.id,
        title: eventTitle,
        message: `Your job posting "${job.title}" has been ${statusText}.`,
      });

      // 2. Dispatch Non-Blocking Transactional Email
      if (employerUser.email) {
        await this.emailProvider.sendTransactionalEmail({
          to: employerUser.email,
          recipientName: employerName,
          subject: `Job Posting Update: ${job.title} (${isApproved ? 'Approved' : 'Rejected'})`,
          title: eventTitle,
          bodyParagraphs: [
            `Your job listing "${job.title}" has been reviewed by the TalentFlow moderation team.`,
            `Status: ${statusText.toUpperCase()}.`,
          ],
          details: [
            { label: 'Job Title', value: job.title },
            { label: 'Status', value: isApproved ? 'PUBLISHED' : 'REJECTED' },
          ],
          ctaText: 'Manage Jobs',
          ctaUrl: 'https://sispl.shop/employer/jobs',
        });
      }
    } catch (error: any) {
      this.logger.error(`[NOTIFY] Error handling notifyJobModeration: ${error.message}`);
    }
  }

  /**
   * 6. Admin Course Approval / Rejection
   * Recipient: Trainer / Course Owner
   */
  async notifyCourseModeration(courseId: string, status: 'PUBLISHED' | 'REJECTED' | 'APPROVED') {
    try {
      const course = await this.prisma.course.findUnique({
        where: { id: courseId },
        include: { trainer: { include: { user: true } } },
      });

      if (!course || !course.trainer?.user) return;

      const trainerUser = course.trainer.user;
      const trainerName = this.getDisplayName(trainerUser);
      const isApproved = status === 'PUBLISHED' || status === 'APPROVED';
      const eventTitle = isApproved ? 'Course Approved' : 'Course Rejected';
      const statusText = isApproved ? 'approved and published live on the marketplace' : 'rejected by moderation';

      // 1. Create In-App Notification Record
      await this.create({
        userId: trainerUser.id,
        title: eventTitle,
        message: `Your course "${course.title}" has been ${statusText}.`,
      });

      // 2. Dispatch Non-Blocking Transactional Email
      if (trainerUser.email) {
        await this.emailProvider.sendTransactionalEmail({
          to: trainerUser.email,
          recipientName: trainerName,
          subject: `Course Status Update: ${course.title} (${isApproved ? 'Approved' : 'Rejected'})`,
          title: eventTitle,
          bodyParagraphs: [
            `Your submitted course "${course.title}" has been reviewed by the TalentFlow quality assurance team.`,
            `Status: ${statusText.toUpperCase()}.`,
          ],
          details: [
            { label: 'Course Title', value: course.title },
            { label: 'Category', value: course.category || 'General' },
            { label: 'Status', value: isApproved ? 'PUBLISHED' : 'REJECTED' },
          ],
          ctaText: 'Manage Courses',
          ctaUrl: 'https://sispl.shop/trainer/courses',
        });
      }
    } catch (error: any) {
      this.logger.error(`[NOTIFY] Error handling notifyCourseModeration: ${error.message}`);
    }
  }

  /**
   * 7. Password Successfully Changed / Reset
   * Recipient: Account Owner as Security Notification
   */
  async notifyPasswordReset(userId: string) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        include: { candidateProfile: true, employerProfile: true, freelancerProfile: true },
      });

      if (!user || !user.email) return;

      const userName = this.getDisplayName(user);
      const eventTitle = 'Security Alert: Password Changed';
      const timestampText = new Date().toUTCString();

      // 1. Create In-App Notification Record
      await this.create({
        userId: user.id,
        title: eventTitle,
        message: `Your TalentFlow account password was updated successfully at ${timestampText}.`,
      });

      // 2. Dispatch Non-Blocking Transactional Email
      await this.emailProvider.sendTransactionalEmail({
        to: user.email,
        recipientName: userName,
        subject: 'Security Alert: TalentFlow Account Password Changed',
        title: eventTitle,
        bodyParagraphs: [
          'The password for your TalentFlow account was recently updated.',
          'If you performed this change, no further action is required.',
          'If you did NOT request or authorize this change, please reset your password immediately and contact support.',
        ],
        details: [
          { label: 'Account Email', value: user.email },
          { label: 'Timestamp', value: timestampText },
        ],
        ctaText: 'Sign In to Account',
        ctaUrl: 'https://sispl.shop/sign-in',
      });
    } catch (error: any) {
      this.logger.error(`[NOTIFY] Error handling notifyPasswordReset: ${error.message}`);
    }
  }
}

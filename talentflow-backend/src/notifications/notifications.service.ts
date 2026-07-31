import { Injectable, Logger, NotFoundException, ForbiddenException } from '@nestjs/common';
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

  /**
   * Secure paginated notification fetch derived strictly from authenticated JWT userId
   */
  async findAllForUser(
    userId: string,
    options?: { page?: number; limit?: number; unreadOnly?: boolean },
  ) {
    const page = Math.max(Number(options?.page) || 1, 1);
    const limit = Math.max(Number(options?.limit) || 20, 1);
    const skip = (page - 1) * limit;

    const where: any = { userId };
    if (options?.unreadOnly) {
      where.isRead = false;
    }

    const [data, total, unreadCount] = await Promise.all([
      this.prisma.notification.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.notification.count({ where }),
      this.prisma.notification.count({ where: { userId, isRead: false } }),
    ]);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      unreadCount,
    };
  }

  /**
   * Secure unread count derived strictly from authenticated JWT userId
   */
  async getUnreadCount(userId: string) {
    const count = await this.prisma.notification.count({
      where: { userId, isRead: false },
    });
    return { count };
  }

  /**
   * Secure single notification find with ownership verification
   */
  async findOneForUser(id: string, userId: string) {
    const notification = await this.prisma.notification.findUnique({
      where: { id },
    });
    if (!notification) {
      throw new NotFoundException('Notification not found');
    }
    if (notification.userId !== userId) {
      throw new ForbiddenException('Forbidden: You do not own this notification');
    }
    return notification;
  }

  /**
   * Secure mark single notification read with ownership verification
   */
  async markAsRead(id: string, userId: string) {
    await this.findOneForUser(id, userId);
    return this.prisma.notification.update({
      where: { id },
      data: { isRead: true },
    });
  }

  /**
   * Secure mark all notifications read for authenticated JWT user
   */
  async markAllAsRead(userId: string) {
    const result = await this.prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true },
    });
    return { success: true, count: result.count };
  }

  /**
   * Secure remove notification with ownership verification
   */
  async removeForUser(id: string, userId: string) {
    await this.findOneForUser(id, userId);
    await this.prisma.notification.delete({ where: { id } });
    return { success: true, message: 'Notification deleted successfully' };
  }

  // Legacy fallback methods (kept for backwards compatibility if internal services call them)
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

      await this.create({
        userId: employerUser.id,
        title: 'New Application Received',
        message: `${candidateName} applied for your job "${jobTitle}".`,
      });

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
      if (!['SHORTLISTED', 'INTERVIEWING', 'OFFERED', 'HIRED', 'REJECTED'].includes(status)) return;

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

      let eventTitle = 'Application Status Updated';
      let message = `Your application for "${jobTitle}" at ${companyName} is now ${status}.`;
      let detailText = 'Please check your application dashboard for further details.';

      if (status === 'SHORTLISTED') {
        eventTitle = 'Application Shortlisted';
        message = `Great news! Your application for "${jobTitle}" has been shortlisted by ${companyName}.`;
        detailText = 'The employer was impressed with your profile and has shortlisted you for further evaluation.';
      } else if (status === 'INTERVIEWING') {
        eventTitle = 'Interview Stage Started';
        message = `Your application for "${jobTitle}" has moved to the interviewing stage.`;
        detailText = 'Please check your schedule and interviews dashboard for upcoming interview requests.';
      } else if (status === 'OFFERED') {
        eventTitle = 'Job Offer Received!';
        message = `Congratulations! ${companyName} has extended a formal job offer for "${jobTitle}".`;
        detailText = 'Please log into TalentFlow to view your offer details and next steps.';
      } else if (status === 'HIRED') {
        eventTitle = 'Congratulations! You are Hired!';
        message = `Exciting news! You have been officially hired for "${jobTitle}" at ${companyName}.`;
        detailText = 'Welcome aboard! The employer will reach out with onboarding instructions.';
      } else if (status === 'REJECTED') {
        eventTitle = 'Application Status Update';
        message = `Thank you for applying for "${jobTitle}" at ${companyName}. Unfortunately, your application was not selected.`;
        detailText = 'We encourage you to explore other matching opportunities on TalentFlow Marketplace.';
      }

      let emailSubject = `${eventTitle} — ${jobTitle}`;
      if (status === 'SHORTLISTED') {
        emailSubject = `Your Application for ${jobTitle} Has Been Shortlisted`;
      } else if (status === 'INTERVIEWING') {
        emailSubject = `Interview Stage Update for ${jobTitle}`;
      }

      await this.create({
        userId: candidateUser.id,
        title: eventTitle,
        message,
      });

      if (candidateUser.email) {
        await this.emailProvider.sendTransactionalEmail({
          to: candidateUser.email,
          recipientName: candidateName,
          subject: emailSubject,
          title: eventTitle,
          bodyParagraphs: [message, detailText],
          details: [
            { label: 'Job Title', value: jobTitle },
            { label: 'Company', value: companyName },
            { label: 'New Status', value: status },
          ],
          ctaText: status === 'SHORTLISTED' ? 'View Applications' : 'View Interviews',
          ctaUrl: status === 'SHORTLISTED'
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

      await this.create({
        userId: employerUser.id,
        title: eventTitle,
        message: `Your job posting "${job.title}" has been ${statusText}.`,
      });

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

      await this.create({
        userId: trainerUser.id,
        title: eventTitle,
        message: `Your course "${course.title}" has been ${statusText}.`,
      });

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

      await this.create({
        userId: user.id,
        title: eventTitle,
        message: `Your TalentFlow account password was updated successfully at ${timestampText}.`,
      });

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

  /**
   * 8. Offer Events (SENT, ACCEPTED, DECLINED, WITHDRAWN)
   */
  async notifyOfferEvent(offerId: string, eventType: 'SENT' | 'ACCEPTED' | 'DECLINED' | 'WITHDRAWN') {
    try {
      const offer = await this.prisma.jobOffer.findUnique({
        where: { id: offerId },
        include: {
          candidate: { include: { user: true } },
          employer: { include: { user: true } },
          job: true,
        },
      });

      if (!offer) return;

      const jobTitle = offer.job.title;
      const companyName = offer.employer.companyName || 'The Employer';

      if (eventType === 'SENT' && offer.candidate?.user) {
        const candidateUser = offer.candidate.user;
        const candidateName = offer.candidate.fullName || this.getDisplayName(candidateUser);
        await this.create({
          userId: candidateUser.id,
          title: 'Job Offer Received!',
          message: `Congratulations! ${companyName} has extended a formal job offer for "${jobTitle}".`,
        });

        if (candidateUser.email) {
          await this.emailProvider.sendTransactionalEmail({
            to: candidateUser.email,
            recipientName: candidateName,
            subject: `Job Offer Extended for ${jobTitle} — ${companyName}`,
            title: 'Job Offer Received!',
            bodyParagraphs: [
              `Congratulations! ${companyName} has extended a formal job offer for position "${jobTitle}".`,
              `Log in to TalentFlow Marketplace to review the offer terms and accept or decline.`,
            ],
            details: [
              { label: 'Job Title', value: jobTitle },
              { label: 'Company', value: companyName },
              { label: 'Salary', value: `${offer.salaryCurrency} ${offer.salaryAmount.toLocaleString()} / ${offer.salaryPeriod}` },
              { label: 'Joining Date', value: new Date(offer.joiningDate).toLocaleDateString('en-US', { dateStyle: 'medium' }) },
            ],
            ctaText: 'View Offer Details',
            ctaUrl: 'https://sispl.shop/job-seeker/offers',
          });
        }
      }

      if (eventType === 'ACCEPTED' && offer.employer?.user) {
        const employerUser = offer.employer.user;
        const employerName = companyName;
        const candidateName = offer.candidate.fullName || this.getDisplayName(offer.candidate.user);

        await this.create({
          userId: employerUser.id,
          title: 'Job Offer Accepted!',
          message: `${candidateName} has accepted your job offer for "${jobTitle}".`,
        });

        if (employerUser.email) {
          await this.emailProvider.sendTransactionalEmail({
            to: employerUser.email,
            recipientName: employerName,
            subject: `Offer Accepted: ${candidateName} — ${jobTitle}`,
            title: 'Job Offer Accepted!',
            bodyParagraphs: [
              `Great news! ${candidateName} has accepted your offer for position "${jobTitle}".`,
              `The application status has been updated to HIRED.`,
            ],
            details: [
              { label: 'Candidate', value: candidateName },
              { label: 'Position', value: jobTitle },
              { label: 'Joining Date', value: new Date(offer.joiningDate).toLocaleDateString('en-US', { dateStyle: 'medium' }) },
            ],
            ctaText: 'View Hiring Pipeline',
            ctaUrl: 'https://sispl.shop/employer/pipeline',
          });
        }
      }

      if (eventType === 'DECLINED' && offer.employer?.user) {
        const employerUser = offer.employer.user;
        const employerName = companyName;
        const candidateName = offer.candidate.fullName || this.getDisplayName(offer.candidate.user);

        await this.create({
          userId: employerUser.id,
          title: 'Job Offer Declined',
          message: `${candidateName} has declined the job offer for "${jobTitle}".`,
        });

        if (employerUser.email) {
          await this.emailProvider.sendTransactionalEmail({
            to: employerUser.email,
            recipientName: employerName,
            subject: `Offer Declined: ${candidateName} — ${jobTitle}`,
            title: 'Job Offer Declined',
            bodyParagraphs: [
              `${candidateName} has declined the job offer for "${jobTitle}".`,
              offer.declineReason ? `Reason provided: "${offer.declineReason}"` : 'No decline reason was provided.',
            ],
            details: [
              { label: 'Candidate', value: candidateName },
              { label: 'Position', value: jobTitle },
            ],
            ctaText: 'View Hiring Pipeline',
            ctaUrl: 'https://sispl.shop/employer/pipeline',
          });
        }
      }

      if (eventType === 'WITHDRAWN' && offer.candidate?.user) {
        const candidateUser = offer.candidate.user;
        const candidateName = offer.candidate.fullName || this.getDisplayName(candidateUser);

        await this.create({
          userId: candidateUser.id,
          title: 'Job Offer Withdrawn',
          message: `The job offer for "${jobTitle}" at ${companyName} has been withdrawn.`,
        });

        if (candidateUser.email) {
          await this.emailProvider.sendTransactionalEmail({
            to: candidateUser.email,
            recipientName: candidateName,
            subject: `Job Offer Update: ${jobTitle}`,
            title: 'Job Offer Withdrawn',
            bodyParagraphs: [
              `The job offer previously extended for "${jobTitle}" at ${companyName} has been withdrawn by the employer.`,
            ],
            details: [
              { label: 'Position', value: jobTitle },
              { label: 'Company', value: companyName },
            ],
            ctaText: 'Browse Other Jobs',
            ctaUrl: 'https://sispl.shop/find-jobs',
          });
        }
      }
    } catch (error: any) {
      this.logger.error(`[NOTIFY] Error handling notifyOfferEvent: ${error.message}`);
    }
  }
}

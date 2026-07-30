"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var NotificationsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const resend_email_provider_1 = require("../auth/providers/resend-email.provider");
let NotificationsService = NotificationsService_1 = class NotificationsService {
    prisma;
    emailProvider;
    logger = new common_1.Logger(NotificationsService_1.name);
    constructor(prisma, emailProvider) {
        this.prisma = prisma;
        this.emailProvider = emailProvider;
    }
    async create(createNotificationDto) {
        return this.prisma.notification.create({ data: createNotificationDto });
    }
    async findAllForUser(userId, options) {
        const page = Math.max(Number(options?.page) || 1, 1);
        const limit = Math.max(Number(options?.limit) || 20, 1);
        const skip = (page - 1) * limit;
        const where = { userId };
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
    async getUnreadCount(userId) {
        const count = await this.prisma.notification.count({
            where: { userId, isRead: false },
        });
        return { count };
    }
    async findOneForUser(id, userId) {
        const notification = await this.prisma.notification.findUnique({
            where: { id },
        });
        if (!notification) {
            throw new common_1.NotFoundException('Notification not found');
        }
        if (notification.userId !== userId) {
            throw new common_1.ForbiddenException('Forbidden: You do not own this notification');
        }
        return notification;
    }
    async markAsRead(id, userId) {
        await this.findOneForUser(id, userId);
        return this.prisma.notification.update({
            where: { id },
            data: { isRead: true },
        });
    }
    async markAllAsRead(userId) {
        const result = await this.prisma.notification.updateMany({
            where: { userId, isRead: false },
            data: { isRead: true },
        });
        return { success: true, count: result.count };
    }
    async removeForUser(id, userId) {
        await this.findOneForUser(id, userId);
        await this.prisma.notification.delete({ where: { id } });
        return { success: true, message: 'Notification deleted successfully' };
    }
    findAll(filters) {
        const where = {};
        if (filters.userId)
            where.userId = filters.userId;
        return this.prisma.notification.findMany({
            where,
            skip: filters.skip,
            take: filters.take,
            orderBy: { createdAt: 'desc' },
        });
    }
    findOne(id, user) {
        return this.prisma.notification.findUnique({ where: { id } });
    }
    update(id, updateNotificationDto, user) {
        return this.prisma.notification.update({
            where: { id },
            data: updateNotificationDto,
        });
    }
    remove(id, user) {
        return this.prisma.notification.delete({ where: { id } });
    }
    getDisplayName(user) {
        if (!user)
            return 'User';
        return (user.candidateProfile?.fullName ||
            user.employerProfile?.companyName ||
            user.freelancerProfile?.fullName ||
            user.email ||
            'User');
    }
    async notifyApplicationSubmitted(applicationId) {
        try {
            const application = await this.prisma.application.findUnique({
                where: { id: applicationId },
                include: {
                    candidate: { include: { user: true } },
                    job: { include: { employer: { include: { user: true } } } },
                },
            });
            if (!application || !application.job?.employer?.user)
                return;
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
        }
        catch (error) {
            this.logger.error(`[NOTIFY] Error handling notifyApplicationSubmitted: ${error.message}`);
        }
    }
    async notifyApplicationStatusChanged(applicationId, status) {
        try {
            if (!['SHORTLISTED', 'INTERVIEWING'].includes(status))
                return;
            const application = await this.prisma.application.findUnique({
                where: { id: applicationId },
                include: {
                    candidate: { include: { user: true } },
                    job: { include: { employer: true } },
                },
            });
            if (!application || !application.candidate?.user)
                return;
            const candidateUser = application.candidate.user;
            const candidateName = application.candidate.fullName || this.getDisplayName(candidateUser);
            const jobTitle = application.job.title;
            const companyName = application.job.employer?.companyName || 'The Employer';
            const isShortlisted = status === 'SHORTLISTED';
            const eventTitle = isShortlisted ? 'Application Shortlisted' : 'Interview Stage Started';
            const message = isShortlisted
                ? `Great news! Your application for "${jobTitle}" has been shortlisted by ${companyName}.`
                : `Your application for "${jobTitle}" has moved to the interviewing stage.`;
            await this.create({
                userId: candidateUser.id,
                title: eventTitle,
                message,
            });
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
        }
        catch (error) {
            this.logger.error(`[NOTIFY] Error handling notifyApplicationStatusChanged: ${error.message}`);
        }
    }
    async notifyInterviewEvent(interviewId, eventType) {
        try {
            const interview = await this.prisma.interview.findUnique({
                where: { id: interviewId },
                include: {
                    candidate: { include: { user: true } },
                    employer: { include: { user: true } },
                    application: { include: { job: true } },
                },
            });
            if (!interview)
                return;
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
        }
        catch (error) {
            this.logger.error(`[NOTIFY] Error handling notifyInterviewEvent: ${error.message}`);
        }
    }
    async notifyJobModeration(jobId, status) {
        try {
            const job = await this.prisma.job.findUnique({
                where: { id: jobId },
                include: { employer: { include: { user: true } } },
            });
            if (!job || !job.employer?.user)
                return;
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
        }
        catch (error) {
            this.logger.error(`[NOTIFY] Error handling notifyJobModeration: ${error.message}`);
        }
    }
    async notifyCourseModeration(courseId, status) {
        try {
            const course = await this.prisma.course.findUnique({
                where: { id: courseId },
                include: { trainer: { include: { user: true } } },
            });
            if (!course || !course.trainer?.user)
                return;
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
        }
        catch (error) {
            this.logger.error(`[NOTIFY] Error handling notifyCourseModeration: ${error.message}`);
        }
    }
    async notifyPasswordReset(userId) {
        try {
            const user = await this.prisma.user.findUnique({
                where: { id: userId },
                include: { candidateProfile: true, employerProfile: true, freelancerProfile: true },
            });
            if (!user || !user.email)
                return;
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
        }
        catch (error) {
            this.logger.error(`[NOTIFY] Error handling notifyPasswordReset: ${error.message}`);
        }
    }
};
exports.NotificationsService = NotificationsService;
exports.NotificationsService = NotificationsService = NotificationsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        resend_email_provider_1.ResendEmailProvider])
], NotificationsService);
//# sourceMappingURL=notifications.service.js.map
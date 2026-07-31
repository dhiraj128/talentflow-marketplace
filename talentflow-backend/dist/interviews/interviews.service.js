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
Object.defineProperty(exports, "__esModule", { value: true });
exports.InterviewsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const audit_logs_service_1 = require("../audit-logs/audit-logs.service");
const notifications_service_1 = require("../notifications/notifications.service");
let InterviewsService = class InterviewsService {
    prisma;
    auditLogsService;
    notificationsService;
    constructor(prisma, auditLogsService, notificationsService) {
        this.prisma = prisma;
        this.auditLogsService = auditLogsService;
        this.notificationsService = notificationsService;
    }
    async checkOverlap(employerId, candidateId, start, durationMins, excludeInterviewId) {
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
                    throw new common_1.ConflictException('You have an overlapping interview scheduled at this time');
                if (iv.candidateId === candidateId)
                    throw new common_1.ConflictException('The candidate has an overlapping interview scheduled at this time');
            }
        }
    }
    async schedule(createInterviewDto, userId) {
        const employerProfile = await this.prisma.employerProfile.findUnique({
            where: { userId },
        });
        if (!employerProfile)
            throw new common_1.NotFoundException('Employer profile not found');
        const application = await this.prisma.application.findUnique({
            where: { id: createInterviewDto.applicationId },
            include: { job: true, candidate: { include: { user: true } } },
        });
        if (!application)
            throw new common_1.NotFoundException('Application not found');
        if (application.job.employerId !== employerProfile.id)
            throw new common_1.ForbiddenException('You do not own this application');
        const scheduledAt = new Date(createInterviewDto.scheduledAt);
        if (scheduledAt < new Date())
            throw new common_1.BadRequestException('Cannot schedule an interview in the past');
        const existingForApp = await this.prisma.interview.findFirst({
            where: { applicationId: application.id, status: { in: ['SCHEDULED'] } },
        });
        if (existingForApp)
            throw new common_1.ConflictException('Application already has an active scheduled interview');
        await this.checkOverlap(employerProfile.id, application.candidateId, scheduledAt, createInterviewDto.duration || 60);
        const interview = await this.prisma.interview.create({
            data: {
                ...createInterviewDto,
                employerId: employerProfile.id,
                candidateId: application.candidateId,
                createdByUserId: userId,
            },
        });
        if (['PENDING', 'REVIEWING', 'SHORTLISTED'].includes(application.status)) {
            await this.prisma.application.update({
                where: { id: application.id },
                data: { status: 'INTERVIEWING' },
            });
            await this.prisma.applicationStatusHistory.create({
                data: {
                    applicationId: application.id,
                    status: 'INTERVIEWING',
                    changedByUserId: userId,
                    note: 'Interview scheduled',
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
    async findAllByEmployer(userId) {
        const employerProfile = await this.prisma.employerProfile.findUnique({
            where: { userId },
        });
        if (!employerProfile)
            return [];
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
    async findAllByCandidate(userId) {
        const candidateProfile = await this.prisma.candidateProfile.findUnique({
            where: { userId },
        });
        if (!candidateProfile)
            return [];
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
        return interviews.map((iv) => ({
            ...iv,
            notes: null,
            feedback: null,
        }));
    }
    async findOne(id, userId, role) {
        const interview = await this.prisma.interview.findUnique({
            where: { id },
            include: {
                candidate: { include: { user: true } },
                employer: { include: { user: true } },
                application: { include: { job: true } },
                feedbackList: role === 'EMPLOYER' || role === 'ADMIN',
            },
        });
        if (!interview)
            throw new common_1.NotFoundException('Interview not found');
        if (role === 'EMPLOYER' && interview.employer.userId !== userId)
            throw new common_1.ForbiddenException('You do not own this interview');
        if (role === 'CANDIDATE' && interview.candidate.userId !== userId)
            throw new common_1.ForbiddenException('You do not own this interview');
        if (role === 'CANDIDATE') {
            return {
                ...interview,
                notes: null,
                feedback: null,
            };
        }
        return interview;
    }
    async reschedule(id, updateInterviewDto, userId) {
        const interview = await this.findOne(id, userId, 'EMPLOYER');
        if (updateInterviewDto.scheduledAt) {
            const scheduledAt = new Date(updateInterviewDto.scheduledAt);
            if (scheduledAt < new Date())
                throw new common_1.BadRequestException('Cannot schedule an interview in the past');
            await this.checkOverlap(interview.employerId, interview.candidateId, scheduledAt, updateInterviewDto.duration || interview.duration, interview.id);
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
    async cancel(id, userId, role) {
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
    async complete(id, feedbackNotes, userId) {
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
    async submitFeedback(id, dto, userId) {
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
    async markNoShow(id, userId) {
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
    async remove(id, userId, role) {
        if (role !== 'ADMIN')
            await this.findOne(id, userId, role);
        return this.prisma.interview.delete({ where: { id } });
    }
};
exports.InterviewsService = InterviewsService;
exports.InterviewsService = InterviewsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        audit_logs_service_1.AuditLogsService,
        notifications_service_1.NotificationsService])
], InterviewsService);
//# sourceMappingURL=interviews.service.js.map
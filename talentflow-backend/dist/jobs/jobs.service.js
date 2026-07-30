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
exports.JobsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const notifications_service_1 = require("../notifications/notifications.service");
let JobsService = class JobsService {
    prisma;
    notificationsService;
    constructor(prisma, notificationsService) {
        this.prisma = prisma;
        this.notificationsService = notificationsService;
    }
    async create(createJobDto, userId) {
        const employer = await this.prisma.employerProfile.findUnique({
            where: { userId },
        });
        if (!employer) {
            throw new common_1.NotFoundException('Employer profile not found');
        }
        const data = {
            ...createJobDto,
            employerId: employer.id,
            status: 'DRAFT',
        };
        return this.prisma.job.create({ data });
    }
    async findEmployerJobs(userId) {
        const employer = await this.prisma.employerProfile.findUnique({
            where: { userId },
        });
        if (!employer) {
            throw new common_1.NotFoundException('Employer profile not found');
        }
        const data = await this.prisma.job.findMany({
            where: { employerId: employer.id, deletedAt: null },
            include: {
                applications: true,
                requiredSkills: { include: { skill: true } },
            },
            orderBy: { createdAt: 'desc' },
        });
        return { data, total: data.length };
    }
    async findAll(filters) {
        const where = {
            deletedAt: null,
            status: { in: ['PUBLISHED', 'ACTIVE', 'OPEN'] },
        };
        if (filters.employerId) {
            where.employerId = filters.employerId;
        }
        if (filters.q) {
            where.title = { contains: filters.q, mode: 'insensitive' };
        }
        if (filters.location) {
            where.location = { contains: filters.location, mode: 'insensitive' };
        }
        if (filters.type) {
            where.type = { contains: filters.type, mode: 'insensitive' };
        }
        const page = Number(filters.page) || 1;
        const limit = Number(filters.limit) || 20;
        const skip = (page - 1) * limit;
        const [data, total] = await Promise.all([
            this.prisma.job.findMany({
                where,
                include: {
                    employer: true,
                    requiredSkills: { include: { skill: true } },
                },
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
            }),
            this.prisma.job.count({ where }),
        ]);
        return {
            data,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }
    async findAdminPending(filters) {
        const page = Number(filters.page) || 1;
        const limit = Number(filters.limit) || 20;
        const skip = (page - 1) * limit;
        const where = { deletedAt: null, status: 'DRAFT' };
        const [data, total] = await Promise.all([
            this.prisma.job.findMany({
                where,
                include: {
                    employer: true,
                    requiredSkills: { include: { skill: true } },
                },
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
            }),
            this.prisma.job.count({ where }),
        ]);
        return {
            data,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }
    findOne(id) {
        return this.prisma.job.findUnique({
            where: { id },
            include: { employer: true, requiredSkills: { include: { skill: true } } },
        });
    }
    async update(id, updateJobDto, user) {
        if (user.role === 'EMPLOYER') {
            const employer = await this.prisma.employerProfile.findUnique({
                where: { userId: user.sub || user.userId },
            });
            if (!employer)
                throw new common_1.NotFoundException('Employer profile not found');
            const job = await this.prisma.job.findUnique({ where: { id } });
            if (!job || job.employerId !== employer.id) {
                throw new common_1.ForbiddenException('You do not have permission to modify this job');
            }
        }
        const updated = await this.prisma.job.update({ where: { id }, data: updateJobDto });
        const status = updateJobDto.status;
        if (status && ['PUBLISHED', 'APPROVED', 'REJECTED', 'CLOSED'].includes(status)) {
            await this.notificationsService.notifyJobModeration(id, status);
        }
        return updated;
    }
    async remove(id, user) {
        if (user.role === 'EMPLOYER') {
            const employer = await this.prisma.employerProfile.findUnique({
                where: { userId: user.sub || user.userId },
            });
            if (!employer)
                throw new common_1.NotFoundException('Employer profile not found');
            const job = await this.prisma.job.findUnique({ where: { id } });
            if (!job || job.employerId !== employer.id) {
                throw new common_1.ForbiddenException('You do not have permission to modify this job');
            }
        }
        return this.prisma.job.delete({ where: { id } });
    }
    async approveJob(id, user) {
        if (user.role !== 'ADMIN') {
            throw new common_1.ForbiddenException('Only Admins can approve jobs');
        }
        const updated = await this.prisma.job.update({
            where: { id },
            data: { status: 'PUBLISHED' },
        });
        await this.notificationsService.notifyJobModeration(id, 'PUBLISHED');
        return updated;
    }
    async rejectJob(id, user) {
        if (user.role !== 'ADMIN') {
            throw new common_1.ForbiddenException('Only Admins can reject jobs');
        }
        const updated = await this.prisma.job.update({
            where: { id },
            data: { status: 'CLOSED' },
        });
        await this.notificationsService.notifyJobModeration(id, 'REJECTED');
        return updated;
    }
    async applyToJob(jobId, userId, resumeId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: { role: true, candidateProfile: true },
        });
        if (!user || user.role !== 'CANDIDATE' || !user.candidateProfile) {
            throw new common_1.ForbiddenException('Only registered candidates can apply for jobs');
        }
        const job = await this.prisma.job.findUnique({ where: { id: jobId } });
        if (!job || job.deletedAt) {
            throw new common_1.NotFoundException('Job not found');
        }
        if (job.status !== 'PUBLISHED') {
            throw new common_1.BadRequestException('Job is not open for applications');
        }
        const candidateId = user.candidateProfile.id;
        if (resumeId) {
            const resume = await this.prisma.resume.findUnique({
                where: { id: resumeId },
            });
            if (!resume || resume.candidateId !== candidateId) {
                throw new common_1.ForbiddenException('You do not have permission to use this resume');
            }
        }
        const existing = await this.prisma.application.findUnique({
            where: { candidateId_jobId: { candidateId, jobId } },
        });
        if (existing) {
            throw new common_1.BadRequestException('Already applied to this job');
        }
        const application = await this.prisma.application.create({
            data: {
                candidateId,
                jobId,
                resumeId,
                status: 'PENDING',
            },
        });
        await this.notificationsService.notifyApplicationSubmitted(application.id);
        return application;
    }
    async checkApplicationStatus(jobId, userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: { candidateProfile: true, role: true },
        });
        if (!user || user.role !== 'CANDIDATE' || !user.candidateProfile) {
            return { hasApplied: false };
        }
        const application = await this.prisma.application.findUnique({
            where: {
                candidateId_jobId: { candidateId: user.candidateProfile.id, jobId },
            },
        });
        if (application) {
            return {
                hasApplied: true,
                applicationId: application.id,
                status: application.status,
            };
        }
        return { hasApplied: false };
    }
};
exports.JobsService = JobsService;
exports.JobsService = JobsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        notifications_service_1.NotificationsService])
], JobsService);
//# sourceMappingURL=jobs.service.js.map
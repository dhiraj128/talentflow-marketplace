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
exports.ApplicationsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ApplicationsService = class ApplicationsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createApplicationDto) {
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
        return this.prisma.application.create({
            data: {
                ...createApplicationDto,
                matchScore,
            },
        });
    }
    async findAll(filters) {
        const where = {};
        if (filters.candidateId)
            where.candidateId = filters.candidateId;
        if (filters.jobId)
            where.jobId = filters.jobId;
        if (filters.employerId)
            where.job = { employerId: filters.employerId };
        const page = Number(filters.page) || 1;
        const limit = Number(filters.limit) || 20;
        const skip = (page - 1) * limit;
        const [data, total] = await Promise.all([
            this.prisma.application.findMany({
                where,
                include: { candidate: true, job: { include: { employer: true } } },
                orderBy: { appliedAt: 'desc' },
                skip,
                take: limit,
            }),
            this.prisma.application.count({ where }),
        ]);
        return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
    }
    async findOne(id, user) {
        const application = await this.prisma.application.findUnique({
            where: { id },
            include: { candidate: true, job: { include: { employer: true } } },
        });
        if (!application)
            throw new common_1.NotFoundException('Application not found');
        if (user && user.role !== 'ADMIN') {
            const isCandidate = application.candidate.userId === (user.sub || user.userId);
            const isEmployer = application.job.employer.userId === (user.sub || user.userId);
            if (!isCandidate && !isEmployer)
                throw new common_1.ForbiddenException('Forbidden');
        }
        return application;
    }
    async update(id, updateApplicationDto, user) {
        const application = await this.prisma.application.findUnique({
            where: { id },
            include: { candidate: true, job: { include: { employer: true } } },
        });
        if (!application)
            throw new common_1.NotFoundException('Application not found');
        if (user && user.role !== 'ADMIN') {
            const isCandidate = application.candidate.userId === (user.sub || user.userId);
            const isEmployer = application.job.employer.userId === (user.sub || user.userId);
            if (!isCandidate && !isEmployer)
                throw new common_1.ForbiddenException('Forbidden');
        }
        return this.prisma.application.update({
            where: { id },
            data: updateApplicationDto,
        });
    }
    async remove(id, user) {
        const application = await this.prisma.application.findUnique({
            where: { id },
            include: { candidate: true, job: { include: { employer: true } } },
        });
        if (!application)
            throw new common_1.NotFoundException('Application not found');
        if (user && user.role !== 'ADMIN') {
            const isCandidate = application.candidate.userId === (user.sub || user.userId);
            const isEmployer = application.job.employer.userId === (user.sub || user.userId);
            if (!isCandidate && !isEmployer)
                throw new common_1.ForbiddenException('Forbidden');
        }
        await this.prisma.application.delete({ where: { id } });
        return { success: true };
    }
    async findEmployerApplications(userId) {
        const employer = await this.prisma.employerProfile.findUnique({
            where: { userId },
        });
        if (!employer) {
            throw new common_1.NotFoundException('Employer profile not found');
        }
        const page = 1;
        const limit = 50;
        const skip = 0;
        const [data, total] = await Promise.all([
            this.prisma.application.findMany({
                where: { job: { employerId: employer.id } },
                include: { candidate: true, job: { include: { employer: true } } },
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
    async updateStatus(id, status, user) {
        if (user.role !== 'EMPLOYER') {
            throw new common_1.ForbiddenException('Only employers can update application status');
        }
        const employer = await this.prisma.employerProfile.findUnique({
            where: { userId: user.sub || user.userId },
        });
        if (!employer) {
            throw new common_1.NotFoundException('Employer profile not found');
        }
        const application = await this.prisma.application.findUnique({
            where: { id },
            include: { job: true },
        });
        if (!application || application.job.employerId !== employer.id) {
            throw new common_1.BadRequestException('Forbidden: Cannot modify applications for other employers');
        }
        const validStatuses = [
            'PENDING',
            'REVIEWING',
            'INTERVIEWING',
            'OFFERED',
            'REJECTED',
        ];
        if (!validStatuses.includes(status)) {
            throw new common_1.BadRequestException(`Invalid status: ${status}`);
        }
        return this.prisma.application.update({
            where: { id },
            data: { status: status },
        });
    }
};
exports.ApplicationsService = ApplicationsService;
exports.ApplicationsService = ApplicationsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ApplicationsService);
//# sourceMappingURL=applications.service.js.map
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
exports.CandidatesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let CandidatesService = class CandidatesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    create(createCandidateDto) {
        return this.prisma.candidateProfile.create({ data: createCandidateDto });
    }
    findAll(skip = 0, take = 10) {
        return this.prisma.candidateProfile.findMany({
            skip,
            take,
            include: {
                certificates: {
                    include: {
                        course: {
                            include: { trainer: true },
                        },
                    },
                },
            },
        });
    }
    async findOne(id, user) {
        const candidate = await this.prisma.candidateProfile.findUnique({
            where: { id },
            include: {
                skills: true,
                certificates: {
                    include: {
                        course: {
                            include: { trainer: true },
                        },
                    },
                },
            },
        });
        if (!candidate)
            throw new common_1.NotFoundException('Candidate not found');
        if (user && user.role !== 'ADMIN' && candidate.userId !== (user.sub || user.userId)) {
            throw new common_1.ForbiddenException('Forbidden');
        }
        let completionScore = 0;
        if (candidate.fullName)
            completionScore += 10;
        if (candidate.title)
            completionScore += 10;
        if (candidate.location)
            completionScore += 10;
        if (candidate.avatarUrl)
            completionScore += 10;
        if (candidate.resumeUrl)
            completionScore += 10;
        if (candidate.bio)
            completionScore += 10;
        if (candidate.education)
            completionScore += 10;
        if (candidate.experience)
            completionScore += 10;
        if (candidate.githubUrl || candidate.linkedinUrl || candidate.portfolioUrl)
            completionScore += 10;
        if (candidate.skills && candidate.skills.length > 0)
            completionScore += 10;
        return { ...candidate, completionScore };
    }
    async update(id, updateCandidateDto, user) {
        const candidate = await this.prisma.candidateProfile.findUnique({ where: { id } });
        if (!candidate)
            throw new common_1.NotFoundException('Candidate not found');
        if (user && user.role !== 'ADMIN' && candidate.userId !== (user.sub || user.userId)) {
            throw new common_1.ForbiddenException('Forbidden');
        }
        const { skills, ...restData } = updateCandidateDto;
        const updated = await this.prisma.candidateProfile.update({
            where: { id },
            data: restData,
        });
        if (skills && Array.isArray(skills)) {
            const skillIds = [];
            for (const skillName of skills) {
                let skill = await this.prisma.skill.findUnique({ where: { name: skillName } });
                if (!skill) {
                    skill = await this.prisma.skill.create({ data: { name: skillName } });
                }
                skillIds.push(skill.id);
            }
            await this.prisma.candidateSkill.deleteMany({ where: { candidateId: id } });
            for (const sId of skillIds) {
                await this.prisma.candidateSkill.create({
                    data: { candidateId: id, skillId: sId }
                });
            }
        }
        return updated;
    }
    async remove(id, user) {
        const candidate = await this.prisma.candidateProfile.findUnique({ where: { id } });
        if (!candidate)
            throw new common_1.NotFoundException('Candidate not found');
        if (user && user.role !== 'ADMIN' && candidate.userId !== (user.sub || user.userId)) {
            throw new common_1.ForbiddenException('Forbidden');
        }
        await this.prisma.candidateProfile.delete({ where: { id } });
        return { success: true };
    }
};
exports.CandidatesService = CandidatesService;
exports.CandidatesService = CandidatesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CandidatesService);
//# sourceMappingURL=candidates.service.js.map
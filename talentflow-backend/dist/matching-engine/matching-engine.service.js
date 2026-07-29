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
exports.MatchingEngineService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let MatchingEngineService = class MatchingEngineService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async calculateMatch(candidateId, jobId) {
        const candidateSkills = await this.prisma.candidateSkill.findMany({
            where: { candidateId },
            include: { skill: true },
        });
        const jobSkills = await this.prisma.jobSkill.findMany({
            where: { jobId },
            include: { skill: true },
        });
        if (jobSkills.length === 0)
            return { score: 100 };
        let matched = 0;
        for (const reqSkill of jobSkills) {
            if (candidateSkills.some((cs) => cs.skillId === reqSkill.skillId)) {
                matched++;
            }
        }
        const score = Math.round((matched / jobSkills.length) * 100);
        return { candidateId, jobId, score };
    }
    async getRecommendedJobs(candidateId) {
        const jobs = await this.prisma.job.findMany({
            where: { status: 'PUBLISHED' },
            include: { employer: true, requiredSkills: { include: { skill: true } } },
        });
        const recommendations = await Promise.all(jobs.map(async (job) => {
            const { score } = await this.calculateMatch(candidateId, job.id);
            return { ...job, matchScore: score };
        }));
        return recommendations.sort((a, b) => b.matchScore - a.matchScore);
    }
    async getRecommendedCandidates(jobId) {
        const candidates = await this.prisma.candidateProfile.findMany({
            include: { user: true, skills: { include: { skill: true } } },
        });
        const recommendations = await Promise.all(candidates.map(async (candidate) => {
            const { score } = await this.calculateMatch(candidate.id, jobId);
            return { ...candidate, matchScore: score };
        }));
        return recommendations.sort((a, b) => b.matchScore - a.matchScore);
    }
};
exports.MatchingEngineService = MatchingEngineService;
exports.MatchingEngineService = MatchingEngineService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], MatchingEngineService);
//# sourceMappingURL=matching-engine.service.js.map
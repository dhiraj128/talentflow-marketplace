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
exports.SearchService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let SearchService = class SearchService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async searchTalent(q, location) {
        const where = { role: 'CANDIDATE' };
        if (q) {
            where.candidateProfile = {
                fullName: { contains: q, mode: 'insensitive' },
            };
        }
        const users = await this.prisma.user.findMany({
            where,
            include: {
                candidateProfile: {
                    include: {
                        skills: { include: { skill: true } },
                    },
                },
            },
            take: 20,
        });
        return users
            .filter((u) => u.candidateProfile)
            .map((u) => ({
            id: u.id,
            name: u.candidateProfile.fullName,
            role: u.candidateProfile.title || 'Candidate',
            location: u.candidateProfile.location || 'Remote',
            rating: 4.8,
            availableNow: true,
            experience: '3+ Years',
            skills: u.candidateProfile.skills.map((s) => s.skill.name),
            certification: 'Verified Profile',
        }));
    }
    async searchJobs(q, location) {
        const where = { status: 'PUBLISHED' };
        if (q) {
            where.title = { contains: q, mode: 'insensitive' };
        }
        const jobs = await this.prisma.job.findMany({
            where,
            include: {
                employer: true,
                requiredSkills: { include: { skill: true } },
            },
            take: 20,
        });
        return jobs.map((j) => ({
            id: j.id,
            title: j.title,
            company: j.employer.companyName,
            location: j.location || 'Remote',
            salary: j.salaryRange || 'Competitive',
            type: j.type || 'Full-time',
            posted: j.createdAt.toISOString(),
            matchScore: 90,
            skills: j.requiredSkills.map((s) => s.skill.name),
            logo: j.employer.logoUrl,
        }));
    }
    async searchFreelancers(q, location) {
        const where = { role: 'FREELANCER' };
        if (q) {
            where.freelancerProfile = {
                fullName: { contains: q, mode: 'insensitive' },
            };
        }
        const users = await this.prisma.user.findMany({
            where,
            include: {
                freelancerProfile: true,
            },
            take: 20,
        });
        return users
            .filter((u) => u.freelancerProfile)
            .map((u) => ({
            id: u.id,
            name: u.freelancerProfile.fullName,
            title: u.freelancerProfile.title || 'Freelancer',
            hourlyRate: u.freelancerProfile.hourlyRate || 50,
            rating: 4.9,
            completedJobs: 15,
            skills: ['React', 'Node.js', 'TypeScript'],
        }));
    }
    async searchCourses(q, location) {
        const where = {};
        if (q) {
            where.title = { contains: q, mode: 'insensitive' };
        }
        const courses = await this.prisma.course.findMany({
            where,
            include: {
                trainer: true,
            },
            take: 20,
        });
        return courses.map((c) => ({
            id: c.id,
            title: c.title,
            instructor: c.trainer.fullName,
            rating: c.rating,
            students: c.studentCount,
            duration: '10 hours',
            level: 'Intermediate',
            thumbnail: c.thumbnailUrl,
        }));
    }
    async getJobSuggestions(q) {
        if (!q || q.length < 2)
            return { suggestions: [] };
        const jobs = await this.prisma.job.findMany({
            where: {
                status: 'PUBLISHED',
                title: { contains: q, mode: 'insensitive' },
            },
            distinct: ['title'],
            select: { title: true },
            take: 4,
        });
        const skills = await this.prisma.skill.findMany({
            where: { name: { contains: q, mode: 'insensitive' } },
            select: { name: true },
            take: 3,
        });
        const companies = await this.prisma.employerProfile.findMany({
            where: { companyName: { contains: q, mode: 'insensitive' } },
            select: { companyName: true },
            take: 2,
        });
        const suggestions = [
            ...jobs.map((j) => ({ text: j.title, type: 'job_title' })),
            ...skills.map((s) => ({ text: s.name, type: 'skill' })),
            ...companies.map((c) => ({ text: c.companyName, type: 'company' })),
        ].slice(0, 8);
        return { suggestions };
    }
    async getJobLocations(q) {
        if (!q) {
            return {
                locations: ['Remote', 'Bangalore', 'Mumbai', 'Pune', 'Delhi NCR'],
            };
        }
        const jobs = await this.prisma.job.findMany({
            where: {
                status: 'PUBLISHED',
                location: { contains: q, mode: 'insensitive' },
                NOT: { location: null },
            },
            distinct: ['location'],
            select: { location: true },
            take: 6,
        });
        const locations = jobs.map((j) => j.location).filter(Boolean);
        if ('remote'.includes(q.toLowerCase()) &&
            !locations.some((l) => l.toLowerCase() === 'remote')) {
            locations.push('Remote');
        }
        return { locations: locations.slice(0, 6) };
    }
};
exports.SearchService = SearchService;
exports.SearchService = SearchService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SearchService);
//# sourceMappingURL=search.service.js.map
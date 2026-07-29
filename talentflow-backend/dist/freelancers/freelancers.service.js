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
exports.FreelancersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let FreelancersService = class FreelancersService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(query) {
        const { skills, location, rateMin, rateMax } = query || {};
        const whereClause = { isVerified: true };
        if (location) {
            whereClause.location = { contains: location, mode: 'insensitive' };
        }
        if (rateMin || rateMax) {
            whereClause.hourlyRate = {};
            if (rateMin)
                whereClause.hourlyRate.gte = parseFloat(rateMin);
            if (rateMax)
                whereClause.hourlyRate.lte = parseFloat(rateMax);
        }
        if (skills && skills.length > 0) {
            const skillsArray = Array.isArray(skills) ? skills : skills.split(',');
            whereClause.skills = {
                some: {
                    skill: {
                        name: { in: skillsArray },
                    },
                },
            };
        }
        return this.prisma.freelancerProfile.findMany({
            where: whereClause,
            include: {
                skills: {
                    include: { skill: true },
                },
            },
            orderBy: { rating: 'desc' },
        });
    }
    async findAllAdmin() {
        return this.prisma.freelancerProfile.findMany({
            include: {
                user: true,
                skills: {
                    include: { skill: true },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async findOne(id, user) {
        const profile = await this.prisma.freelancerProfile.findUnique({
            where: { id },
            include: {
                skills: {
                    include: { skill: true },
                },
                reviews: {
                    include: {
                        employer: true,
                    },
                },
            },
        });
        if (!profile) {
            throw new common_1.NotFoundException('Freelancer profile not found');
        }
        return profile;
    }
    async getMe(userId) {
        const profile = await this.prisma.freelancerProfile.findUnique({
            where: { userId },
            include: {
                skills: {
                    include: { skill: true },
                },
                reviews: {
                    include: {
                        employer: true,
                    },
                },
            },
        });
        if (!profile) {
            throw new common_1.NotFoundException('Freelancer profile not found');
        }
        return profile;
    }
    async updateMe(userId, updateData) {
        const { skills, ...data } = updateData;
        const profile = await this.prisma.freelancerProfile.findUnique({
            where: { userId },
        });
        if (!profile) {
            throw new common_1.NotFoundException('Freelancer profile not found');
        }
        if (skills && Array.isArray(skills)) {
            const skillIds = [];
            for (const skillName of skills) {
                let skill = await this.prisma.skill.findUnique({
                    where: { name: skillName },
                });
                if (!skill) {
                    skill = await this.prisma.skill.create({ data: { name: skillName } });
                }
                skillIds.push(skill.id);
            }
            await this.prisma.freelancerSkill.deleteMany({
                where: { freelancerId: profile.id },
            });
            if (skillIds.length > 0) {
                await this.prisma.freelancerSkill.createMany({
                    data: skillIds.map((skillId) => ({
                        freelancerId: profile.id,
                        skillId,
                        proficiency: 5,
                    })),
                });
            }
        }
        return this.prisma.freelancerProfile.update({
            where: { id: profile.id },
            data,
            include: {
                skills: {
                    include: { skill: true },
                },
            },
        });
    }
    async verify(id, isVerified) {
        const profile = await this.prisma.freelancerProfile.findUnique({
            where: { id },
        });
        if (!profile) {
            throw new common_1.NotFoundException('Freelancer profile not found');
        }
        return this.prisma.freelancerProfile.update({
            where: { id },
            data: { isVerified },
        });
    }
};
exports.FreelancersService = FreelancersService;
exports.FreelancersService = FreelancersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], FreelancersService);
//# sourceMappingURL=freelancers.service.js.map
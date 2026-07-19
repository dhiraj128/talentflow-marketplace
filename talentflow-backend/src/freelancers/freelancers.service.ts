import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FreelancersService {
  constructor(private prisma: PrismaService) {}

  async findAll(query?: any) {
    const { skills, location, rateMin, rateMax } = query || {};

    // Only return verified freelancers for public marketplace
    const whereClause: any = { isVerified: true };

    if (location) {
      whereClause.location = { contains: location, mode: 'insensitive' };
    }

    if (rateMin || rateMax) {
      whereClause.hourlyRate = {};
      if (rateMin) whereClause.hourlyRate.gte = parseFloat(rateMin);
      if (rateMax) whereClause.hourlyRate.lte = parseFloat(rateMax);
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

  async findOne(id: string) {
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
      throw new NotFoundException('Freelancer profile not found');
    }

    return profile;
  }

  async getMe(userId: string) {
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
      throw new NotFoundException('Freelancer profile not found');
    }
    return profile;
  }

  async updateMe(userId: string, updateData: any) {
    const { skills, ...data } = updateData;

    const profile = await this.prisma.freelancerProfile.findUnique({
      where: { userId },
    });

    if (!profile) {
      throw new NotFoundException('Freelancer profile not found');
    }

    // Handle skills update
    if (skills && Array.isArray(skills)) {
      // First, get or create the skills
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

      // Delete existing M2M relations for this freelancer
      await this.prisma.freelancerSkill.deleteMany({
        where: { freelancerId: profile.id },
      });

      // Create new M2M relations
      if (skillIds.length > 0) {
        await this.prisma.freelancerSkill.createMany({
          data: skillIds.map((skillId) => ({
            freelancerId: profile.id,
            skillId,
            proficiency: 5, // Default for now
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

  async verify(id: string, isVerified: boolean) {
    const profile = await this.prisma.freelancerProfile.findUnique({
      where: { id },
    });
    if (!profile) {
      throw new NotFoundException('Freelancer profile not found');
    }

    return this.prisma.freelancerProfile.update({
      where: { id },
      data: { isVerified },
    });
  }
}

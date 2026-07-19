import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateCandidateDto,
  UpdateCandidateDto,
} from './dto/create-candidate.dto';

@Injectable()
export class CandidatesService {
  constructor(private readonly prisma: PrismaService) {}

  create(createCandidateDto: CreateCandidateDto) {
    return this.prisma.candidateProfile.create({ data: createCandidateDto });
  }

  findAll(skip: number = 0, take: number = 10) {
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

  async findOne(id: string, user?: any) {
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
    if (!candidate) throw new NotFoundException('Candidate not found');

    if (user && user.role !== 'ADMIN' && candidate.userId !== (user.sub || user.userId)) {
      throw new ForbiddenException('Forbidden');
    }

    let completionScore = 0;
    if (candidate.fullName) completionScore += 10;
    if (candidate.title) completionScore += 10;
    if (candidate.location) completionScore += 10;
    if (candidate.avatarUrl) completionScore += 10;
    if (candidate.resumeUrl) completionScore += 10;
    if (candidate.bio) completionScore += 10;
    if (candidate.education) completionScore += 10;
    if (candidate.experience) completionScore += 10;
    if (candidate.githubUrl || candidate.linkedinUrl || candidate.portfolioUrl)
      completionScore += 10;
    if (candidate.skills && candidate.skills.length > 0) completionScore += 10;

    return { ...candidate, completionScore };
  }

  async update(id: string, updateCandidateDto: UpdateCandidateDto, user?: any) {
    const candidate = await this.prisma.candidateProfile.findUnique({ where: { id } });
    if (!candidate) throw new NotFoundException('Candidate not found');
    if (user && user.role !== 'ADMIN' && candidate.userId !== (user.sub || user.userId)) {
      throw new ForbiddenException('Forbidden');
    }
    return await this.prisma.candidateProfile.update({
      where: { id },
      data: updateCandidateDto,
    });
  }

  async remove(id: string, user?: any) {
    const candidate = await this.prisma.candidateProfile.findUnique({ where: { id } });
    if (!candidate) throw new NotFoundException('Candidate not found');
    if (user && user.role !== 'ADMIN' && candidate.userId !== (user.sub || user.userId)) {
      throw new ForbiddenException('Forbidden');
    }
    await this.prisma.candidateProfile.delete({ where: { id } });
    return { success: true };
  }
}

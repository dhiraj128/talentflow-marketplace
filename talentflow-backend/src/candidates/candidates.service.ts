import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCandidateDto, UpdateCandidateDto } from './dto/create-candidate.dto';

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
              include: { trainer: true }
            }
          }
        }
      }
    });
  }

  async findOne(id: string) {
    const candidate = await this.prisma.candidateProfile.findUnique({ 
      where: { id },
      include: {
        certificates: {
          include: {
            course: {
              include: { trainer: true }
            }
          }
        }
      }
    });
    if (!candidate) throw new NotFoundException('Candidate not found');
    return candidate;
  }

  async update(id: string, updateCandidateDto: UpdateCandidateDto) {
    try {
      return await this.prisma.candidateProfile.update({
        where: { id },
        data: updateCandidateDto,
      });
    } catch {
      throw new NotFoundException('Candidate not found');
    }
  }

  async remove(id: string) {
    try {
      await this.prisma.candidateProfile.delete({ where: { id } });
      return { success: true };
    } catch {
      throw new NotFoundException('Candidate not found');
    }
  }
}

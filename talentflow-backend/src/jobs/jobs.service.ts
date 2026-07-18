import { Injectable, ForbiddenException, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';

@Injectable()
export class JobsService {
  constructor(private prisma: PrismaService) {}

  async create(createJobDto: CreateJobDto, userId: string) {
    const employer = await this.prisma.employerProfile.findUnique({ where: { userId } });
    if (!employer) {
      throw new NotFoundException('Employer profile not found');
    }
    
    // Force employerId to the authenticated employer and status to DRAFT
    const data = {
      ...createJobDto,
      employerId: employer.id,
      status: 'DRAFT' as const
    };
    
    return this.prisma.job.create({ data });
  }

  async findEmployerJobs(userId: string) {
    const employer = await this.prisma.employerProfile.findUnique({ where: { userId } });
    if (!employer) {
      throw new NotFoundException('Employer profile not found');
    }

    const data = await this.prisma.job.findMany({
      where: { employerId: employer.id, deletedAt: null },
      include: { applications: true, requiredSkills: { include: { skill: true } } },
      orderBy: { createdAt: 'desc' }
    });

    return { data, total: data.length };
  }

  async findAll(filters: any) {
    const where: any = { deletedAt: null, status: 'PUBLISHED' };
    if (filters.employerId) {
      where.employerId = filters.employerId;
      delete where.status; // allow employer to see draft jobs too
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
        include: { employer: true, requiredSkills: { include: { skill: true } } },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      this.prisma.job.count({ where })
    ]);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    };
  }

  findOne(id: string) {
    return this.prisma.job.findUnique({ 
      where: { id },
      include: { employer: true, requiredSkills: { include: { skill: true } } }
    });
  }

  async update(id: string, updateJobDto: UpdateJobDto, user: any) {
    if (user.role === 'EMPLOYER') {
      const employer = await this.prisma.employerProfile.findUnique({ where: { userId: user.sub || user.userId } });
      if (!employer) throw new NotFoundException('Employer profile not found');
      
      const job = await this.prisma.job.findUnique({ where: { id } });
      if (!job || job.employerId !== employer.id) {
        throw new ForbiddenException('You do not have permission to modify this job');
      }
    }
    return this.prisma.job.update({ where: { id }, data: updateJobDto });
  }

  async remove(id: string, user: any) {
    if (user.role === 'EMPLOYER') {
      const employer = await this.prisma.employerProfile.findUnique({ where: { userId: user.sub || user.userId } });
      if (!employer) throw new NotFoundException('Employer profile not found');
      
      const job = await this.prisma.job.findUnique({ where: { id } });
      if (!job || job.employerId !== employer.id) {
        throw new ForbiddenException('You do not have permission to modify this job');
      }
    }
    return this.prisma.job.delete({ where: { id } });
  }

  async approveJob(id: string, user: any) {
    if (user.role !== 'ADMIN') {
      throw new ForbiddenException('Only Admins can approve jobs');
    }
    return this.prisma.job.update({
      where: { id },
      data: { status: 'PUBLISHED' }
    });
  }

  async applyToJob(jobId: string, userId: string, resumeId?: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { role: true, candidateProfile: true }
    });

    if (!user || user.role !== 'CANDIDATE' || !user.candidateProfile) {
      throw new ForbiddenException('Only registered candidates can apply for jobs');
    }

    const job = await this.prisma.job.findUnique({ where: { id: jobId } });
    if (!job || job.deletedAt) {
      throw new NotFoundException('Job not found');
    }

    if (job.status !== 'PUBLISHED') {
      throw new BadRequestException('Job is not open for applications');
    }

    const candidateId = user.candidateProfile.id;

    if (resumeId) {
      const resume = await this.prisma.resume.findUnique({ where: { id: resumeId } });
      if (!resume || resume.candidateId !== candidateId) {
        throw new ForbiddenException('You do not have permission to use this resume');
      }
    }

    // Check if already applied
    const existing = await this.prisma.application.findUnique({
      where: { candidateId_jobId: { candidateId, jobId } }
    });

    if (existing) {
      throw new BadRequestException('Already applied to this job');
    }

    return this.prisma.application.create({
      data: {
        candidateId,
        jobId,
        resumeId,
        status: 'PENDING'
      }
    });
  }

  async checkApplicationStatus(jobId: string, userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { candidateProfile: true, role: true }
    });

    if (!user || user.role !== 'CANDIDATE' || !user.candidateProfile) {
      return { hasApplied: false };
    }

    const application = await this.prisma.application.findUnique({
      where: { candidateId_jobId: { candidateId: user.candidateProfile.id, jobId } }
    });

    if (application) {
      return { hasApplied: true, applicationId: application.id, status: application.status };
    }

    return { hasApplied: false };
  }
}

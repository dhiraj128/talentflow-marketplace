import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationDto } from './dto/update-application.dto';

@Injectable()
export class ApplicationsService {
  constructor(private prisma: PrismaService) {}

  create(createApplicationDto: CreateApplicationDto) {
    return this.prisma.application.create({ data: createApplicationDto });
  }

  async findAll(filters: any) {
    const where: any = {};
    if (filters.candidateId) where.candidateId = filters.candidateId;
    if (filters.jobId) where.jobId = filters.jobId;
    if (filters.employerId) where.job = { employerId: filters.employerId };
    
    const page = Number(filters.page) || 1;
    const limit = Number(filters.limit) || 20;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.prisma.application.findMany({ 
        where, 
        include: { candidate: true, job: { include: { employer: true } } },
        orderBy: { appliedAt: 'desc' },
        skip,
        take: limit
      }),
      this.prisma.application.count({ where })
    ]);

    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  findOne(id: string) {
    return this.prisma.application.findUnique({ 
      where: { id },
      include: { candidate: true, job: { include: { employer: true } } }
    });
  }

  update(id: string, updateApplicationDto: UpdateApplicationDto) {
    return this.prisma.application.update({ where: { id }, data: updateApplicationDto });
  }

  remove(id: string) {
    return this.prisma.application.delete({ where: { id } });
  }

  async findEmployerApplications(userId: string) {
    const employer = await this.prisma.employerProfile.findUnique({ where: { userId } });
    if (!employer) {
      throw new NotFoundException('Employer profile not found');
    }

    const page = 1;
    const limit = 50; // default for now, could add filters if needed
    const skip = 0;

    const [data, total] = await Promise.all([
      this.prisma.application.findMany({ 
        where: { job: { employerId: employer.id } }, 
        include: { candidate: true, job: { include: { employer: true } } },
        orderBy: { appliedAt: 'desc' },
        skip,
        take: limit
      }),
      this.prisma.application.count({ where: { job: { employerId: employer.id } } })
    ]);

    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async updateStatus(id: string, status: string, user: any) {
    if (user.role !== 'EMPLOYER') {
      throw new ForbiddenException('Only employers can update application status');
    }
    
    const employer = await this.prisma.employerProfile.findUnique({ where: { userId: user.sub || user.userId } });
    if (!employer) {
      throw new NotFoundException('Employer profile not found');
    }

    const application = await this.prisma.application.findUnique({
      where: { id },
      include: { job: true }
    });

    if (!application || application.job.employerId !== employer.id) {
      throw new BadRequestException('Forbidden: Cannot modify applications for other employers');
    }

    const validStatuses = ['PENDING', 'REVIEWING', 'INTERVIEWING', 'OFFERED', 'REJECTED'];
    if (!validStatuses.includes(status)) {
      throw new BadRequestException(`Invalid status: ${status}`);
    }

    return this.prisma.application.update({ 
      where: { id }, 
      data: { status: status as any } 
    });
  }
}

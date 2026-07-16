import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';

@Injectable()
export class JobsService {
  constructor(private prisma: PrismaService) {}

  create(createJobDto: CreateJobDto) {
    return this.prisma.job.create({ data: createJobDto });
  }

  findAll(filters: any) {
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
    return this.prisma.job.findMany({ 
      where, 
      include: { employer: true, applications: true },
      orderBy: { createdAt: 'desc' }
    });
  }

  findOne(id: string) {
    return this.prisma.job.findUnique({ 
      where: { id },
      include: { employer: true, applications: true }
    });
  }

  update(id: string, updateJobDto: UpdateJobDto) {
    return this.prisma.job.update({ where: { id }, data: updateJobDto });
  }

  remove(id: string) {
    return this.prisma.job.delete({ where: { id } });
  }
}

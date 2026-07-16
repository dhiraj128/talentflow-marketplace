import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationDto } from './dto/update-application.dto';

@Injectable()
export class ApplicationsService {
  constructor(private prisma: PrismaService) {}

  create(createApplicationDto: CreateApplicationDto) {
    return this.prisma.application.create({ data: createApplicationDto });
  }

  findAll(filters: any) {
    const where: any = {};
    if (filters.candidateId) where.candidateId = filters.candidateId;
    if (filters.jobId) where.jobId = filters.jobId;
    if (filters.employerId) where.job = { employerId: filters.employerId };
    
    return this.prisma.application.findMany({ 
      where, 
      include: { candidate: true, job: { include: { employer: true } } },
      orderBy: { appliedAt: 'desc' }
    });
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
}

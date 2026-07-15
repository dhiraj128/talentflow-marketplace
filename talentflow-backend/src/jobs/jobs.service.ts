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

  findAll(skip?: number, take?: number) {
    return this.prisma.job.findMany({ skip, take });
  }

  findOne(id: string) {
    return this.prisma.job.findUnique({ where: { id } });
  }

  update(id: string, updateJobDto: UpdateJobDto) {
    return this.prisma.job.update({ where: { id }, data: updateJobDto });
  }

  remove(id: string) {
    return this.prisma.job.delete({ where: { id } });
  }
}

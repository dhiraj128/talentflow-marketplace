import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto';
import { UpdateEnrollmentDto } from './dto/update-enrollment.dto';

@Injectable()
export class EnrollmentsService {
  constructor(private prisma: PrismaService) {}

  create(createEnrollmentDto: CreateEnrollmentDto) {
    return this.prisma.enrollment.create({ data: createEnrollmentDto });
  }

  findAll(skip?: number, take?: number) {
    return this.prisma.enrollment.findMany({ skip, take });
  }

  findOne(id: string) {
    return this.prisma.enrollment.findUnique({ where: { id } });
  }

  update(id: string, updateEnrollmentDto: UpdateEnrollmentDto) {
    return this.prisma.enrollment.update({ where: { id }, data: updateEnrollmentDto });
  }

  remove(id: string) {
    return this.prisma.enrollment.delete({ where: { id } });
  }
}

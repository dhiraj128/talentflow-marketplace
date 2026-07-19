import { Injectable , ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto';
import { UpdateEnrollmentDto } from './dto/update-enrollment.dto';

@Injectable()
export class EnrollmentsService {
  constructor(private prisma: PrismaService) {}

  create(createEnrollmentDto: CreateEnrollmentDto) {
    return this.prisma.enrollment.create({ data: createEnrollmentDto });
  }

  findAll(filters: any) {
    const where: any = {};
    if (filters.candidateId) where.candidateId = filters.candidateId;
    if (filters.courseId) where.courseId = filters.courseId;
    return this.prisma.enrollment.findMany({
      where,
      include: { course: true },
      orderBy: { enrolledAt: 'desc' },
    });
  }

  findOne(id: string, user?: any) {
    return this.prisma.enrollment.findUnique({ where: { id } });
  }

  update(id: string, updateEnrollmentDto: UpdateEnrollmentDto, user?: any) {
    return this.prisma.enrollment.update({
      where: { id },
      data: updateEnrollmentDto,
    });
  }

  remove(id: string, user?: any) {
    return this.prisma.enrollment.delete({ where: { id } });
  }
}

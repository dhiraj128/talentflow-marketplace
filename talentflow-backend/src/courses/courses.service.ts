import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';

@Injectable()
export class CoursesService {
  constructor(private prisma: PrismaService) {}

  create(createCourseDto: CreateCourseDto) {
    return this.prisma.course.create({ data: createCourseDto as any });
  }

  findAll(filters: any) {
    const where: any = {};
    if (filters.q) {
      where.title = { contains: filters.q, mode: 'insensitive' };
    }
    if (filters.category) {
      where.category = { contains: filters.category, mode: 'insensitive' };
    }
    if (filters.trainerId) {
      where.trainerId = filters.trainerId;
    }
    return this.prisma.course.findMany({ 
      where,
      include: { trainer: true },
      orderBy: { createdAt: 'desc' }
    });
  }

  findOne(id: string) {
    return this.prisma.course.findUnique({ where: { id } });
  }

  update(id: string, updateCourseDto: UpdateCourseDto) {
    return this.prisma.course.update({ where: { id }, data: updateCourseDto });
  }

  remove(id: string) {
    return this.prisma.course.delete({ where: { id } });
  }
}

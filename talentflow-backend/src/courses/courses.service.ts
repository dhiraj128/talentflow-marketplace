import {
  Injectable,
  ForbiddenException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';

@Injectable()
export class CoursesService {
  constructor(private prisma: PrismaService) {}

  async create(createCourseDto: CreateCourseDto, trainerId: string) {
    const trainer = await this.prisma.trainerProfile.findUnique({
      where: { id: trainerId },
    });
    if (!trainer || !trainer.isVerified) {
      throw new ForbiddenException(
        'You must be a verified trainer to create courses',
      );
    }
    return this.prisma.course.create({
      data: {
        ...(createCourseDto as any),
        trainerId,
        status: 'DRAFT',
      },
    });
  }

  async findAll(filters: any) {
    const where: any = { status: 'PUBLISHED' };
    if (filters.q) {
      where.title = { contains: filters.q, mode: 'insensitive' };
    }
    if (filters.category) {
      where.category = { contains: filters.category, mode: 'insensitive' };
    }
    if (filters.trainerId) {
      where.trainerId = filters.trainerId;
      // If it's a trainer fetching their own courses, we shouldn't restrict to PUBLISHED if they want to see all
      // For now, public searches use this. We'll stick to PUBLISHED.
      // If trainer dashboard needs it, they should have a separate endpoint or we bypass status.
      // But let's assume public API.
    }
    const page = Number(filters.page) || 1;
    const limit = Number(filters.limit) || 20;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.prisma.course.findMany({
        where,
        include: { trainer: true, modules: true },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.course.count({ where }),
    ]);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string) {
    const course = await this.prisma.course.findUnique({
      where: { id },
      include: {
        trainer: true,
        modules: {
          include: {
            lessons: {
              orderBy: { order: 'asc' },
            },
          },
          orderBy: { order: 'asc' },
        },
      },
    });
    if (!course) throw new NotFoundException('Course not found');
    return course;
  }

  async update(
    id: string,
    updateCourseDto: UpdateCourseDto,
    trainerId: string,
  ) {
    const course = await this.prisma.course.findUnique({ where: { id } });
    if (!course || course.trainerId !== trainerId) {
      throw new ForbiddenException('You can only update your own courses');
    }
    return this.prisma.course.update({
      where: { id },
      data: updateCourseDto as any,
    });
  }

  async remove(id: string, trainerId: string) {
    const course = await this.prisma.course.findUnique({ where: { id } });
    if (!course || course.trainerId !== trainerId) {
      throw new ForbiddenException('You can only delete your own courses');
    }
    return this.prisma.course.delete({ where: { id } });
  }

  async approve(id: string) {
    const course = await this.prisma.course.findUnique({ where: { id } });
    if (!course) throw new NotFoundException('Course not found');
    if (course.status !== 'PENDING')
      throw new BadRequestException('Only PENDING courses can be approved');
    return this.prisma.course.update({
      where: { id },
      data: { status: 'PUBLISHED' },
    });
  }

  async submit(id: string, trainerId: string) {
    const course = await this.prisma.course.findUnique({ where: { id } });
    if (!course || course.trainerId !== trainerId) {
      throw new ForbiddenException('You can only submit your own courses');
    }
    if (course.status !== 'DRAFT' && course.status !== 'REJECTED') {
      throw new BadRequestException(
        'Only DRAFT or REJECTED courses can be submitted',
      );
    }
    return this.prisma.course.update({
      where: { id },
      data: { status: 'PENDING' },
    });
  }

  async getMyLearning(candidateId: string) {
    return this.prisma.enrollment.findMany({
      where: { candidateId },
      include: {
        course: {
          include: { trainer: true, modules: { include: { lessons: true } } },
        },
        lessonProgress: true,
      },
      orderBy: { enrolledAt: 'desc' },
    });
  }

  async enroll(courseId: string, candidateId: string) {
    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
    });
    if (!course) throw new NotFoundException('Course not found');
    if (course.status !== 'PUBLISHED') {
      throw new BadRequestException('Course not available for enrollment');
    }

    const existing = await this.prisma.enrollment.findUnique({
      where: { candidateId_courseId: { candidateId, courseId } },
    });

    if (existing) {
      throw new BadRequestException('Already enrolled in this course');
    }

    return this.prisma.enrollment.create({
      data: {
        candidateId,
        courseId,
        progress: 0,
      },
    });
  }

  async createModule(courseId: string, data: any, trainerId: string) {
    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
    });
    if (!course || course.trainerId !== trainerId)
      throw new ForbiddenException('Cannot modify this course');

    return this.prisma.courseModule.create({
      data: {
        ...data,
        courseId,
      },
    });
  }

  async createLesson(moduleId: string, data: any, trainerId: string) {
    const module = await this.prisma.courseModule.findUnique({
      where: { id: moduleId },
      include: { course: true },
    });
    if (!module || module.course.trainerId !== trainerId)
      throw new ForbiddenException('Cannot modify this course');

    return this.prisma.lesson.create({
      data: {
        ...data,
        moduleId,
      },
    });
  }

  async createAssessment(courseId: string, data: any, trainerId: string) {
    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
    });
    if (!course || course.trainerId !== trainerId)
      throw new ForbiddenException('Cannot modify this course');

    return this.prisma.assessment.create({
      data: {
        ...data,
        courseId,
      },
    });
  }

  async createQuestion(assessmentId: string, data: any, trainerId: string) {
    const assessment = await this.prisma.assessment.findUnique({
      where: { id: assessmentId },
      include: { course: true },
    });
    if (!assessment || assessment.course.trainerId !== trainerId)
      throw new ForbiddenException('Cannot modify this course');

    return this.prisma.question.create({
      data: {
        ...data,
        assessmentId,
      },
    });
  }
}

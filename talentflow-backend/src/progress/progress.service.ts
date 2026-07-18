import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProgressService {
  constructor(private prisma: PrismaService) {}

  async markLessonComplete(lessonId: string, candidateId: string) {
    // Check if lesson exists and get courseId
    const lesson = await this.prisma.lesson.findUnique({
      where: { id: lessonId },
      include: { module: { include: { course: true } } }
    });
    if (!lesson) throw new NotFoundException('Lesson not found');
    const courseId = lesson.module.course.id;

    // Check if enrolled
    const enrollment = await this.prisma.enrollment.findUnique({
      where: { candidateId_courseId: { candidateId, courseId } }
    });
    if (!enrollment) throw new BadRequestException('Not enrolled in this course');

    // Create or update LessonProgress
    await this.prisma.lessonProgress.upsert({
      where: { enrollmentId_lessonId: { enrollmentId: enrollment.id, lessonId } },
      create: { enrollmentId: enrollment.id, lessonId, isCompleted: true, completedAt: new Date() },
      update: { isCompleted: true, completedAt: new Date() }
    });

    // Calculate course progress
    const totalLessons = await this.prisma.lesson.count({
      where: { module: { courseId } }
    });
    const completedLessons = await this.prisma.lessonProgress.count({
      where: { enrollmentId: enrollment.id, isCompleted: true }
    });

    const progress = totalLessons === 0 ? 100 : Math.round((completedLessons / totalLessons) * 100);

    const updatedEnrollment = await this.prisma.enrollment.update({
      where: { id: enrollment.id },
      data: { progress, completedAt: progress === 100 ? new Date() : null }
    });

    return updatedEnrollment;
  }
}

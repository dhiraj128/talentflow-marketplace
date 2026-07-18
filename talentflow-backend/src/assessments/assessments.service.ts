import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AssessmentsService {
  constructor(private prisma: PrismaService) {}

  async submitAssessment(courseId: string, candidateId: string, answers: Record<string, string>) {
    const assessment = await this.prisma.assessment.findUnique({
      where: { courseId },
      include: { questions: true }
    });

    if (!assessment) {
      throw new NotFoundException('Assessment not found for this course');
    }

    const enrollment = await this.prisma.enrollment.findUnique({
      where: { candidateId_courseId: { candidateId, courseId } }
    });

    if (!enrollment) {
      throw new BadRequestException('Not enrolled in this course');
    }

    // Calculate score
    let correctCount = 0;
    const totalQuestions = assessment.questions.length;

    for (const question of assessment.questions) {
      const options = question.options as any[];
      const correctOption = options.find(o => o.isCorrect);
      if (correctOption && answers[question.id] === correctOption.text) {
        correctCount++;
      }
    }

    const score = totalQuestions === 0 ? 100 : Math.round((correctCount / totalQuestions) * 100);
    const passed = score >= assessment.passingScore;

    const attempt = await this.prisma.assessmentAttempt.create({
      data: {
        enrollmentId: enrollment.id,
        assessmentId: assessment.id,
        score,
        passed,
      }
    });

    // If passed, generate certificate
    if (passed && enrollment.progress === 100) {
      const existingCert = await this.prisma.certificate.findUnique({
        where: { candidateId_courseId: { candidateId, courseId } }
      });

      if (!existingCert) {
        await this.prisma.certificate.create({
          data: {
            candidateId,
            courseId,
            certificateUrl: `/certificates/${courseId}-${candidateId}.pdf` // Placeholder URL
          }
        });
      }
    }

    return {
      attempt,
      passed,
      score,
      totalQuestions,
      correctCount
    };
  }
}

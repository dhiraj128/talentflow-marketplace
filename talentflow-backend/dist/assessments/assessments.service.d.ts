import { PrismaService } from '../prisma/prisma.service';
export declare class AssessmentsService {
    private prisma;
    constructor(prisma: PrismaService);
    submitAssessment(courseId: string, candidateId: string, answers: Record<string, string>): Promise<{
        attempt: {
            id: string;
            enrollmentId: string;
            assessmentId: string;
            score: number;
            passed: boolean;
            attemptedAt: Date;
        };
        passed: boolean;
        score: number;
        totalQuestions: number;
        correctCount: number;
    }>;
}

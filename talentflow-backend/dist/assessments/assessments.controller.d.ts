import { AssessmentsService } from './assessments.service';
export declare class AssessmentsController {
    private readonly assessmentsService;
    constructor(assessmentsService: AssessmentsService);
    submitAssessment(courseId: string, answers: Record<string, string>, user: any): Promise<{
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

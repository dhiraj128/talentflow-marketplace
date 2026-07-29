import { ProgressService } from './progress.service';
export declare class ProgressController {
    private readonly progressService;
    constructor(progressService: ProgressService);
    markLessonComplete(lessonId: string, user: any): Promise<{
        id: string;
        candidateId: string;
        courseId: string;
        progress: number;
        enrolledAt: Date;
        completedAt: Date | null;
    }>;
}

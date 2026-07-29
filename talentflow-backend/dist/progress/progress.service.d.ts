import { PrismaService } from '../prisma/prisma.service';
export declare class ProgressService {
    private prisma;
    constructor(prisma: PrismaService);
    markLessonComplete(lessonId: string, candidateId: string): Promise<{
        id: string;
        candidateId: string;
        courseId: string;
        progress: number;
        enrolledAt: Date;
        completedAt: Date | null;
    }>;
}

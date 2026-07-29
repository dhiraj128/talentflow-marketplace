import { EnrollmentsService } from './enrollments.service';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto';
import { UpdateEnrollmentDto } from './dto/update-enrollment.dto';
export declare class EnrollmentsController {
    private readonly enrollmentsService;
    constructor(enrollmentsService: EnrollmentsService);
    create(createEnrollmentDto: CreateEnrollmentDto): import(".prisma/client").Prisma.Prisma__EnrollmentClient<{
        id: string;
        candidateId: string;
        courseId: string;
        progress: number;
        enrolledAt: Date;
        completedAt: Date | null;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    findAll(candidateId?: string, courseId?: string): import(".prisma/client").Prisma.PrismaPromise<({
        course: {
            id: string;
            title: string;
            category: string;
            description: string;
            thumbnailUrl: string | null;
            rating: number | null;
            studentCount: number;
            createdAt: Date;
            updatedAt: Date;
            trainerId: string;
            duration: string | null;
            level: string | null;
            price: number;
            status: import(".prisma/client").$Enums.CourseStatus;
        };
    } & {
        id: string;
        candidateId: string;
        courseId: string;
        progress: number;
        enrolledAt: Date;
        completedAt: Date | null;
    })[]>;
    findOne(id: string, user: any): import(".prisma/client").Prisma.Prisma__EnrollmentClient<{
        id: string;
        candidateId: string;
        courseId: string;
        progress: number;
        enrolledAt: Date;
        completedAt: Date | null;
    } | null, null, import("@prisma/client/runtime/library").DefaultArgs>;
    update(id: string, updateEnrollmentDto: UpdateEnrollmentDto, user: any): import(".prisma/client").Prisma.Prisma__EnrollmentClient<{
        id: string;
        candidateId: string;
        courseId: string;
        progress: number;
        enrolledAt: Date;
        completedAt: Date | null;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    remove(id: string, user: any): import(".prisma/client").Prisma.Prisma__EnrollmentClient<{
        id: string;
        candidateId: string;
        courseId: string;
        progress: number;
        enrolledAt: Date;
        completedAt: Date | null;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
}

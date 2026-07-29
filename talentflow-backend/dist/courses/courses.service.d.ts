import { PrismaService } from '../prisma/prisma.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
export declare class CoursesService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createCourseDto: CreateCourseDto, trainerId: string): Promise<{
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
    }>;
    findAll(filters: any): Promise<{
        data: ({
            trainer: {
                id: string;
                userId: string;
                fullName: string;
                bio: string | null;
                expertise: string | null;
                avatarUrl: string | null;
                rating: number | null;
                isVerified: boolean;
                createdAt: Date;
                updatedAt: Date;
            };
            modules: {
                id: string;
                courseId: string;
                title: string;
                description: string | null;
                order: number;
                createdAt: Date;
                updatedAt: Date;
            }[];
        } & {
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
        })[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    findOne(id: string): Promise<{
        trainer: {
            id: string;
            userId: string;
            fullName: string;
            bio: string | null;
            expertise: string | null;
            avatarUrl: string | null;
            rating: number | null;
            isVerified: boolean;
            createdAt: Date;
            updatedAt: Date;
        };
        modules: ({
            lessons: {
                id: string;
                moduleId: string;
                title: string;
                content: string | null;
                videoUrl: string | null;
                duration: number | null;
                order: number;
                createdAt: Date;
                updatedAt: Date;
            }[];
        } & {
            id: string;
            courseId: string;
            title: string;
            description: string | null;
            order: number;
            createdAt: Date;
            updatedAt: Date;
        })[];
    } & {
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
    }>;
    update(id: string, updateCourseDto: UpdateCourseDto, trainerId: string): Promise<{
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
    }>;
    remove(id: string, trainerId: string): Promise<{
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
    }>;
    approve(id: string): Promise<{
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
    }>;
    submit(id: string, trainerId: string): Promise<{
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
    }>;
    getMyLearning(candidateId: string): Promise<({
        course: {
            trainer: {
                id: string;
                userId: string;
                fullName: string;
                bio: string | null;
                expertise: string | null;
                avatarUrl: string | null;
                rating: number | null;
                isVerified: boolean;
                createdAt: Date;
                updatedAt: Date;
            };
            modules: ({
                lessons: {
                    id: string;
                    moduleId: string;
                    title: string;
                    content: string | null;
                    videoUrl: string | null;
                    duration: number | null;
                    order: number;
                    createdAt: Date;
                    updatedAt: Date;
                }[];
            } & {
                id: string;
                courseId: string;
                title: string;
                description: string | null;
                order: number;
                createdAt: Date;
                updatedAt: Date;
            })[];
        } & {
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
        lessonProgress: {
            enrollmentId: string;
            lessonId: string;
            isCompleted: boolean;
            completedAt: Date | null;
        }[];
    } & {
        id: string;
        candidateId: string;
        courseId: string;
        progress: number;
        enrolledAt: Date;
        completedAt: Date | null;
    })[]>;
    enroll(courseId: string, candidateId: string): Promise<{
        id: string;
        candidateId: string;
        courseId: string;
        progress: number;
        enrolledAt: Date;
        completedAt: Date | null;
    }>;
    createModule(courseId: string, data: any, trainerId: string): Promise<{
        id: string;
        courseId: string;
        title: string;
        description: string | null;
        order: number;
        createdAt: Date;
        updatedAt: Date;
    }>;
    createLesson(moduleId: string, data: any, trainerId: string): Promise<{
        id: string;
        moduleId: string;
        title: string;
        content: string | null;
        videoUrl: string | null;
        duration: number | null;
        order: number;
        createdAt: Date;
        updatedAt: Date;
    }>;
    createAssessment(courseId: string, data: any, trainerId: string): Promise<{
        id: string;
        courseId: string;
        title: string;
        passingScore: number;
    }>;
    createQuestion(assessmentId: string, data: any, trainerId: string): Promise<{
        id: string;
        assessmentId: string;
        text: string;
        options: import(".prisma/client").Prisma.JsonValue;
    }>;
}

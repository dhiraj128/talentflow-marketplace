import { PrismaService } from '../prisma/prisma.service';
import { CreateCandidateDto, UpdateCandidateDto } from './dto/create-candidate.dto';
export declare class CandidatesService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(createCandidateDto: CreateCandidateDto): import(".prisma/client").Prisma.Prisma__CandidateProfileClient<{
        id: string;
        userId: string;
        fullName: string;
        title: string | null;
        location: string | null;
        avatarUrl: string | null;
        resumeUrl: string | null;
        createdAt: Date;
        updatedAt: Date;
        bio: string | null;
        education: import(".prisma/client").Prisma.JsonValue | null;
        experience: import(".prisma/client").Prisma.JsonValue | null;
        githubUrl: string | null;
        linkedinUrl: string | null;
        phone: string | null;
        portfolioUrl: string | null;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    findAll(skip?: number, take?: number): import(".prisma/client").Prisma.PrismaPromise<({
        certificates: ({
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
        } & {
            id: string;
            candidateId: string;
            courseId: string;
            issuedAt: Date;
            certificateUrl: string | null;
        })[];
    } & {
        id: string;
        userId: string;
        fullName: string;
        title: string | null;
        location: string | null;
        avatarUrl: string | null;
        resumeUrl: string | null;
        createdAt: Date;
        updatedAt: Date;
        bio: string | null;
        education: import(".prisma/client").Prisma.JsonValue | null;
        experience: import(".prisma/client").Prisma.JsonValue | null;
        githubUrl: string | null;
        linkedinUrl: string | null;
        phone: string | null;
        portfolioUrl: string | null;
    })[]>;
    findOne(id: string, user?: any): Promise<{
        completionScore: number;
        skills: {
            candidateId: string;
            skillId: string;
            proficiency: number | null;
        }[];
        certificates: ({
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
        } & {
            id: string;
            candidateId: string;
            courseId: string;
            issuedAt: Date;
            certificateUrl: string | null;
        })[];
        id: string;
        userId: string;
        fullName: string;
        title: string | null;
        location: string | null;
        avatarUrl: string | null;
        resumeUrl: string | null;
        createdAt: Date;
        updatedAt: Date;
        bio: string | null;
        education: import(".prisma/client").Prisma.JsonValue | null;
        experience: import(".prisma/client").Prisma.JsonValue | null;
        githubUrl: string | null;
        linkedinUrl: string | null;
        phone: string | null;
        portfolioUrl: string | null;
    }>;
    update(id: string, updateCandidateDto: UpdateCandidateDto, user?: any): Promise<{
        id: string;
        userId: string;
        fullName: string;
        title: string | null;
        location: string | null;
        avatarUrl: string | null;
        resumeUrl: string | null;
        createdAt: Date;
        updatedAt: Date;
        bio: string | null;
        education: import(".prisma/client").Prisma.JsonValue | null;
        experience: import(".prisma/client").Prisma.JsonValue | null;
        githubUrl: string | null;
        linkedinUrl: string | null;
        phone: string | null;
        portfolioUrl: string | null;
    }>;
    remove(id: string, user?: any): Promise<{
        success: boolean;
    }>;
}

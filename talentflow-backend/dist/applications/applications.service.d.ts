import { PrismaService } from '../prisma/prisma.service';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationDto } from './dto/update-application.dto';
export declare class ApplicationsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createApplicationDto: CreateApplicationDto): Promise<{
        id: string;
        candidateId: string;
        jobId: string;
        resumeId: string | null;
        status: import(".prisma/client").$Enums.ApplicationStatus;
        matchScore: number;
        appliedAt: Date;
        updatedAt: Date;
    }>;
    findAll(filters: any): Promise<{
        data: ({
            job: {
                employer: {
                    id: string;
                    userId: string;
                    companyName: string;
                    industry: string | null;
                    logoUrl: string | null;
                    subscription: import(".prisma/client").$Enums.SubscriptionTier;
                    createdAt: Date;
                    updatedAt: Date;
                    bio: string | null;
                    location: string | null;
                    phone: string | null;
                    websiteUrl: string | null;
                };
            } & {
                id: string;
                employerId: string;
                title: string;
                location: string | null;
                type: string | null;
                salaryRange: string | null;
                description: string;
                status: import(".prisma/client").$Enums.JobStatus;
                createdAt: Date;
                updatedAt: Date;
                deletedAt: Date | null;
            };
            candidate: {
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
            };
        } & {
            id: string;
            candidateId: string;
            jobId: string;
            resumeId: string | null;
            status: import(".prisma/client").$Enums.ApplicationStatus;
            matchScore: number;
            appliedAt: Date;
            updatedAt: Date;
        })[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    findOne(id: string, user?: any): Promise<{
        job: {
            employer: {
                id: string;
                userId: string;
                companyName: string;
                industry: string | null;
                logoUrl: string | null;
                subscription: import(".prisma/client").$Enums.SubscriptionTier;
                createdAt: Date;
                updatedAt: Date;
                bio: string | null;
                location: string | null;
                phone: string | null;
                websiteUrl: string | null;
            };
        } & {
            id: string;
            employerId: string;
            title: string;
            location: string | null;
            type: string | null;
            salaryRange: string | null;
            description: string;
            status: import(".prisma/client").$Enums.JobStatus;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
        };
        candidate: {
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
        };
    } & {
        id: string;
        candidateId: string;
        jobId: string;
        resumeId: string | null;
        status: import(".prisma/client").$Enums.ApplicationStatus;
        matchScore: number;
        appliedAt: Date;
        updatedAt: Date;
    }>;
    update(id: string, updateApplicationDto: UpdateApplicationDto, user?: any): Promise<{
        id: string;
        candidateId: string;
        jobId: string;
        resumeId: string | null;
        status: import(".prisma/client").$Enums.ApplicationStatus;
        matchScore: number;
        appliedAt: Date;
        updatedAt: Date;
    }>;
    remove(id: string, user?: any): Promise<{
        success: boolean;
    }>;
    findEmployerApplications(userId: string): Promise<{
        data: ({
            job: {
                employer: {
                    id: string;
                    userId: string;
                    companyName: string;
                    industry: string | null;
                    logoUrl: string | null;
                    subscription: import(".prisma/client").$Enums.SubscriptionTier;
                    createdAt: Date;
                    updatedAt: Date;
                    bio: string | null;
                    location: string | null;
                    phone: string | null;
                    websiteUrl: string | null;
                };
            } & {
                id: string;
                employerId: string;
                title: string;
                location: string | null;
                type: string | null;
                salaryRange: string | null;
                description: string;
                status: import(".prisma/client").$Enums.JobStatus;
                createdAt: Date;
                updatedAt: Date;
                deletedAt: Date | null;
            };
            candidate: {
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
            };
        } & {
            id: string;
            candidateId: string;
            jobId: string;
            resumeId: string | null;
            status: import(".prisma/client").$Enums.ApplicationStatus;
            matchScore: number;
            appliedAt: Date;
            updatedAt: Date;
        })[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    updateStatus(id: string, status: string, user: any): Promise<{
        id: string;
        candidateId: string;
        jobId: string;
        resumeId: string | null;
        status: import(".prisma/client").$Enums.ApplicationStatus;
        matchScore: number;
        appliedAt: Date;
        updatedAt: Date;
    }>;
}

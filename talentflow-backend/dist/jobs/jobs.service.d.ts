import { PrismaService } from '../prisma/prisma.service';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { NotificationsService } from '../notifications/notifications.service';
export declare class JobsService {
    private prisma;
    private notificationsService;
    constructor(prisma: PrismaService, notificationsService: NotificationsService);
    create(createJobDto: CreateJobDto, userId: string): Promise<{
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
    }>;
    findEmployerJobs(userId: string): Promise<{
        data: ({
            applications: {
                id: string;
                candidateId: string;
                jobId: string;
                resumeId: string | null;
                status: import(".prisma/client").$Enums.ApplicationStatus;
                matchScore: number;
                appliedAt: Date;
                updatedAt: Date;
            }[];
            requiredSkills: ({
                skill: {
                    id: string;
                    name: string;
                    category: string | null;
                    createdAt: Date;
                };
            } & {
                jobId: string;
                skillId: string;
                isMandatory: boolean;
            })[];
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
        })[];
        total: number;
    }>;
    findAll(filters: any): Promise<{
        data: ({
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
            requiredSkills: ({
                skill: {
                    id: string;
                    name: string;
                    category: string | null;
                    createdAt: Date;
                };
            } & {
                jobId: string;
                skillId: string;
                isMandatory: boolean;
            })[];
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
        })[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    findAdminPending(filters: any): Promise<{
        data: ({
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
            requiredSkills: ({
                skill: {
                    id: string;
                    name: string;
                    category: string | null;
                    createdAt: Date;
                };
            } & {
                jobId: string;
                skillId: string;
                isMandatory: boolean;
            })[];
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
        })[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    findOne(id: string): import(".prisma/client").Prisma.Prisma__JobClient<({
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
        requiredSkills: ({
            skill: {
                id: string;
                name: string;
                category: string | null;
                createdAt: Date;
            };
        } & {
            jobId: string;
            skillId: string;
            isMandatory: boolean;
        })[];
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
    }) | null, null, import("@prisma/client/runtime/library").DefaultArgs>;
    update(id: string, updateJobDto: UpdateJobDto, user: any): Promise<{
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
    }>;
    remove(id: string, user: any): Promise<{
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
    }>;
    approveJob(id: string, user: any): Promise<{
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
    }>;
    rejectJob(id: string, user: any): Promise<{
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
    }>;
    applyToJob(jobId: string, userId: string, resumeId?: string): Promise<{
        id: string;
        candidateId: string;
        jobId: string;
        resumeId: string | null;
        status: import(".prisma/client").$Enums.ApplicationStatus;
        matchScore: number;
        appliedAt: Date;
        updatedAt: Date;
    }>;
    checkApplicationStatus(jobId: string, userId: string): Promise<{
        hasApplied: boolean;
        applicationId?: undefined;
        status?: undefined;
    } | {
        hasApplied: boolean;
        applicationId: string;
        status: import(".prisma/client").$Enums.ApplicationStatus;
    }>;
}

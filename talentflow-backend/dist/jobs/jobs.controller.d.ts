import { JobsService } from './jobs.service';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
export declare class JobsController {
    private readonly jobsService;
    constructor(jobsService: JobsService);
    create(createJobDto: CreateJobDto, user: any): Promise<{
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
    findAll(q?: string, location?: string, type?: string, employerId?: string, page?: string, limit?: string): Promise<{
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
    getSavedJobs(user: any): Promise<{
        id: string;
        savedJobId: string;
        title: string;
        company: string;
        location: string;
        salary: string;
        type: string;
        savedAt: Date;
    }[]>;
    getRecommendedJobs(user: any): Promise<{
        data: {
            id: any;
            title: any;
            company: any;
            location: any;
            salary: any;
            type: any;
            matchScore: number;
            matchingReasons: string[];
        }[];
        total: number;
    }>;
    findPendingAdmin(page?: string, limit?: string): Promise<{
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
    getEmployerJobs(user: any): Promise<{
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
    applyToJob(id: string, body: {
        resumeId?: string;
    }, user: any): Promise<{
        id: string;
        candidateId: string;
        jobId: string;
        resumeId: string | null;
        status: import(".prisma/client").$Enums.ApplicationStatus;
        matchScore: number;
        appliedAt: Date;
        updatedAt: Date;
    }>;
    checkApplicationStatus(id: string, user: any): Promise<{
        hasApplied: boolean;
        applicationId?: undefined;
        status?: undefined;
    } | {
        hasApplied: boolean;
        applicationId: string;
        status: import(".prisma/client").$Enums.ApplicationStatus;
    }>;
    saveJob(id: string, user: any): Promise<{
        id: string;
        candidateId: string;
        jobId: string;
        createdAt: Date;
    }>;
    unsaveJob(id: string, user: any): Promise<{
        success: boolean;
    }>;
}

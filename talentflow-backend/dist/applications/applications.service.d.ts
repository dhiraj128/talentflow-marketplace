import { PrismaService } from '../prisma/prisma.service';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationDto } from './dto/update-application.dto';
import { NotificationsService } from '../notifications/notifications.service';
export declare class ApplicationsService {
    private prisma;
    private notificationsService;
    constructor(prisma: PrismaService, notificationsService: NotificationsService);
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
            statusHistory: {
                id: string;
                applicationId: string;
                fromStatus: import(".prisma/client").$Enums.ApplicationStatus;
                toStatus: import(".prisma/client").$Enums.ApplicationStatus;
                changedByUserId: string;
                changedByRole: string;
                reason: string | null;
                createdAt: Date;
            }[];
            candidate: {
                id: string;
                userId: string;
                fullName: string;
                title: string | null;
                location: string | null;
                avatarUrl: string | null;
                resumeUrl: string | null;
                profileDiscoverable: boolean;
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
            tags: ({
                tag: {
                    id: string;
                    employerId: string;
                    name: string;
                    color: string | null;
                    createdAt: Date;
                };
            } & {
                applicationId: string;
                tagId: string;
                assignedAt: Date;
            })[];
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
        statusHistory: ({
            user: {
                email: string;
                id: string;
            };
        } & {
            id: string;
            applicationId: string;
            fromStatus: import(".prisma/client").$Enums.ApplicationStatus;
            toStatus: import(".prisma/client").$Enums.ApplicationStatus;
            changedByUserId: string;
            changedByRole: string;
            reason: string | null;
            createdAt: Date;
        })[];
        interviews: {
            id: string;
            applicationId: string;
            employerId: string;
            candidateId: string;
            scheduledAt: Date;
            duration: number;
            timezone: string;
            meetingProvider: string | null;
            meetingUrl: string | null;
            notes: string | null;
            feedback: string | null;
            status: import(".prisma/client").$Enums.InterviewStatus;
            createdAt: Date;
            updatedAt: Date;
        }[];
        notes: {
            id: string;
            applicationId: string;
            employerId: string;
            content: string;
            createdAt: Date;
            updatedAt: Date;
        }[];
        candidate: {
            id: string;
            userId: string;
            fullName: string;
            title: string | null;
            location: string | null;
            avatarUrl: string | null;
            resumeUrl: string | null;
            profileDiscoverable: boolean;
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
        tags: ({
            tag: {
                id: string;
                employerId: string;
                name: string;
                color: string | null;
                createdAt: Date;
            };
        } & {
            applicationId: string;
            tagId: string;
            assignedAt: Date;
        })[];
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
            statusHistory: {
                id: string;
                applicationId: string;
                fromStatus: import(".prisma/client").$Enums.ApplicationStatus;
                toStatus: import(".prisma/client").$Enums.ApplicationStatus;
                changedByUserId: string;
                changedByRole: string;
                reason: string | null;
                createdAt: Date;
            }[];
            interviews: {
                id: string;
                applicationId: string;
                employerId: string;
                candidateId: string;
                scheduledAt: Date;
                duration: number;
                timezone: string;
                meetingProvider: string | null;
                meetingUrl: string | null;
                notes: string | null;
                feedback: string | null;
                status: import(".prisma/client").$Enums.InterviewStatus;
                createdAt: Date;
                updatedAt: Date;
            }[];
            notes: {
                id: string;
                applicationId: string;
                employerId: string;
                content: string;
                createdAt: Date;
                updatedAt: Date;
            }[];
            candidate: {
                id: string;
                userId: string;
                fullName: string;
                title: string | null;
                location: string | null;
                avatarUrl: string | null;
                resumeUrl: string | null;
                profileDiscoverable: boolean;
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
            tags: ({
                tag: {
                    id: string;
                    employerId: string;
                    name: string;
                    color: string | null;
                    createdAt: Date;
                };
            } & {
                applicationId: string;
                tagId: string;
                assignedAt: Date;
            })[];
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
    updateStatus(id: string, status: string, user: any, reason?: string): Promise<{
        id: string;
        candidateId: string;
        jobId: string;
        resumeId: string | null;
        status: import(".prisma/client").$Enums.ApplicationStatus;
        matchScore: number;
        appliedAt: Date;
        updatedAt: Date;
    }>;
    withdraw(id: string, user: any, reason?: string): Promise<{
        id: string;
        candidateId: string;
        jobId: string;
        resumeId: string | null;
        status: import(".prisma/client").$Enums.ApplicationStatus;
        matchScore: number;
        appliedAt: Date;
        updatedAt: Date;
    }>;
    getStatusHistory(id: string, user: any): Promise<({
        user: {
            email: string;
            id: string;
        };
    } & {
        id: string;
        applicationId: string;
        fromStatus: import(".prisma/client").$Enums.ApplicationStatus;
        toStatus: import(".prisma/client").$Enums.ApplicationStatus;
        changedByUserId: string;
        changedByRole: string;
        reason: string | null;
        createdAt: Date;
    })[]>;
    getEmployerPipeline(user: any, query: any): Promise<{
        pipeline: Record<string, any[]>;
        counts: {
            applied: number;
            shortlisted: number;
            interviewing: number;
            offered: number;
            hired: number;
            rejected: number;
            withdrawn: number;
            total: number;
        };
    }>;
    getEmployerAnalytics(user: any): Promise<{
        total: number;
        applied: number;
        shortlisted: number;
        interviewing: number;
        offered: number;
        hired: number;
        conversionRates: {
            appliedToShortlist: number;
            shortlistToInterview: number;
            interviewToOffer: number;
            offerToHire: number;
        };
    }>;
    createNote(applicationId: string, content: string, user: any): Promise<{
        id: string;
        applicationId: string;
        employerId: string;
        content: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    getNotes(applicationId: string, user: any): Promise<{
        id: string;
        applicationId: string;
        employerId: string;
        content: string;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    deleteNote(noteId: string, user: any): Promise<{
        success: boolean;
    }>;
    createTag(name: string, color: string, user: any): Promise<{
        id: string;
        employerId: string;
        name: string;
        color: string | null;
        createdAt: Date;
    }>;
    getTags(user: any): Promise<{
        id: string;
        employerId: string;
        name: string;
        color: string | null;
        createdAt: Date;
    }[]>;
    assignTag(applicationId: string, tagId: string, user: any): Promise<{
        applicationId: string;
        tagId: string;
        assignedAt: Date;
    }>;
    removeTag(applicationId: string, tagId: string, user: any): Promise<{
        success: boolean;
    }>;
}

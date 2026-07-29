import { PrismaService } from '../prisma/prisma.service';
import { CreateInterviewDto } from './dto/create-interview.dto';
import { UpdateInterviewDto } from './dto/update-interview.dto';
import { AuditLogsService } from '../audit-logs/audit-logs.service';
import { NotificationsService } from '../notifications/notifications.service';
export declare class InterviewsService {
    private prisma;
    private auditLogsService;
    private notificationsService;
    constructor(prisma: PrismaService, auditLogsService: AuditLogsService, notificationsService: NotificationsService);
    private checkOverlap;
    schedule(createInterviewDto: CreateInterviewDto, userId: string): Promise<{
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
    }>;
    findAllByEmployer(userId: string): Promise<({
        application: {
            job: {
                title: string;
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
        };
        candidate: {
            user: {
                email: string;
                avatarUrl: string | null;
            };
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
        };
    } & {
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
    })[]>;
    findAllByCandidate(userId: string): Promise<({
        application: {
            job: {
                title: string;
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
        };
        employer: {
            user: {
                email: string;
                avatarUrl: string | null;
            };
        } & {
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
    })[]>;
    findOne(id: string, userId: string, role: string): Promise<{
        application: {
            job: {
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
        } & {
            id: string;
            candidateId: string;
            jobId: string;
            resumeId: string | null;
            status: import(".prisma/client").$Enums.ApplicationStatus;
            matchScore: number;
            appliedAt: Date;
            updatedAt: Date;
        };
        candidate: {
            user: {
                id: string;
                email: string;
                passwordHash: string | null;
                role: import(".prisma/client").$Enums.Role;
                isEmailVerified: boolean;
                phoneVerified: boolean;
                phoneNumber: string | null;
                countryCode: string | null;
                verificationMethod: import(".prisma/client").$Enums.VerificationMethod | null;
                refreshToken: string | null;
                createdAt: Date;
                updatedAt: Date;
                deletedAt: Date | null;
                avatarUrl: string | null;
                githubId: string | null;
                googleId: string | null;
                provider: string | null;
                status: import(".prisma/client").$Enums.UserStatus;
            };
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
        };
        employer: {
            user: {
                id: string;
                email: string;
                passwordHash: string | null;
                role: import(".prisma/client").$Enums.Role;
                isEmailVerified: boolean;
                phoneVerified: boolean;
                phoneNumber: string | null;
                countryCode: string | null;
                verificationMethod: import(".prisma/client").$Enums.VerificationMethod | null;
                refreshToken: string | null;
                createdAt: Date;
                updatedAt: Date;
                deletedAt: Date | null;
                avatarUrl: string | null;
                githubId: string | null;
                googleId: string | null;
                provider: string | null;
                status: import(".prisma/client").$Enums.UserStatus;
            };
        } & {
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
    }>;
    reschedule(id: string, updateInterviewDto: UpdateInterviewDto, userId: string): Promise<{
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
    }>;
    cancel(id: string, userId: string, role: string): Promise<{
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
    }>;
    complete(id: string, feedback: string | undefined, userId: string): Promise<{
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
    }>;
    markNoShow(id: string, userId: string): Promise<{
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
    }>;
    remove(id: string, userId: string, role: string): Promise<{
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
    }>;
}

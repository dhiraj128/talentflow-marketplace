import { PrismaService } from '../prisma/prisma.service';
export declare class ProjectRequestsService {
    private prisma;
    constructor(prisma: PrismaService);
    createRequest(employerUserId: string, createData: any): Promise<{
        id: string;
        employerId: string;
        freelancerId: string;
        title: string;
        description: string;
        budget: number;
        status: import(".prisma/client").$Enums.ProjectRequestStatus;
        createdAt: Date;
        updatedAt: Date;
    }>;
    getFreelancerRequests(freelancerUserId: string): Promise<({
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
        freelancerId: string;
        title: string;
        description: string;
        budget: number;
        status: import(".prisma/client").$Enums.ProjectRequestStatus;
        createdAt: Date;
        updatedAt: Date;
    })[]>;
    getEmployerRequests(employerUserId: string): Promise<({
        freelancer: {
            id: string;
            userId: string;
            fullName: string;
            title: string | null;
            bio: string | null;
            hourlyRate: number | null;
            portfolioUrl: string | null;
            githubUrl: string | null;
            avatarUrl: string | null;
            createdAt: Date;
            updatedAt: Date;
            availability: string | null;
            isVerified: boolean;
            location: string | null;
            rating: number;
            reviewCount: number;
        };
    } & {
        id: string;
        employerId: string;
        freelancerId: string;
        title: string;
        description: string;
        budget: number;
        status: import(".prisma/client").$Enums.ProjectRequestStatus;
        createdAt: Date;
        updatedAt: Date;
    })[]>;
    updateStatus(userId: string, userRole: string, requestId: string, status: 'ACCEPTED' | 'REJECTED' | 'COMPLETED'): Promise<{
        id: string;
        employerId: string;
        freelancerId: string;
        title: string;
        description: string;
        budget: number;
        status: import(".prisma/client").$Enums.ProjectRequestStatus;
        createdAt: Date;
        updatedAt: Date;
    }>;
    createReview(employerUserId: string, requestId: string, reviewData: {
        rating: number;
        text?: string;
    }): Promise<{
        id: string;
        employerId: string;
        freelancerId: string;
        projectRequestId: string;
        rating: number;
        text: string | null;
        createdAt: Date;
    }>;
}

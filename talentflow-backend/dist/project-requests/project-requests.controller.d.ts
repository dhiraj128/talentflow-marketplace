import { CreateReviewDto } from './dto/create-review.dto';
import { CreateProjectRequestDto } from './dto/create-request.dto';
import { ProjectRequestsService } from './project-requests.service';
export declare class ProjectRequestsController {
    private readonly projectRequestsService;
    constructor(projectRequestsService: ProjectRequestsService);
    createRequest(req: any, createData: CreateProjectRequestDto): Promise<{
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
    getFreelancerRequests(req: any): Promise<({
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
    getEmployerRequests(req: any): Promise<({
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
    updateStatus(req: any, id: string, status: 'ACCEPTED' | 'REJECTED' | 'COMPLETED'): Promise<{
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
    createReview(req: any, id: string, reviewData: CreateReviewDto): Promise<{
        id: string;
        reviewerUserId: string;
        subjectUserId: string | null;
        courseId: string | null;
        relationshipType: import(".prisma/client").$Enums.ReviewRelationshipType;
        relationshipId: string;
        rating: number;
        title: string | null;
        comment: string;
        status: import(".prisma/client").$Enums.ReviewStatus;
        createdAt: Date;
        updatedAt: Date;
        employerId: string | null;
        freelancerId: string | null;
        projectRequestId: string | null;
    }>;
}

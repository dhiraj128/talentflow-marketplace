import { UpdateMeDto } from './dto/update-me.dto';
import { FreelancersService } from './freelancers.service';
export declare class FreelancersController {
    private readonly freelancersService;
    constructor(freelancersService: FreelancersService);
    findAll(query: any): Promise<({
        skills: ({
            skill: {
                id: string;
                name: string;
                category: string | null;
                createdAt: Date;
            };
        } & {
            freelancerId: string;
            skillId: string;
            proficiency: number | null;
        })[];
    } & {
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
    })[]>;
    findAllAdmin(): Promise<({
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
        skills: ({
            skill: {
                id: string;
                name: string;
                category: string | null;
                createdAt: Date;
            };
        } & {
            freelancerId: string;
            skillId: string;
            proficiency: number | null;
        })[];
    } & {
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
    })[]>;
    getMe(req: any): Promise<{
        reviews: ({
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
            } | null;
        } & {
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
        })[];
        skills: ({
            skill: {
                id: string;
                name: string;
                category: string | null;
                createdAt: Date;
            };
        } & {
            freelancerId: string;
            skillId: string;
            proficiency: number | null;
        })[];
    } & {
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
    }>;
    findOne(id: string): Promise<{
        reviews: ({
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
            } | null;
        } & {
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
        })[];
        skills: ({
            skill: {
                id: string;
                name: string;
                category: string | null;
                createdAt: Date;
            };
        } & {
            freelancerId: string;
            skillId: string;
            proficiency: number | null;
        })[];
    } & {
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
    }>;
    updateMe(req: any, updateData: UpdateMeDto): Promise<{
        skills: ({
            skill: {
                id: string;
                name: string;
                category: string | null;
                createdAt: Date;
            };
        } & {
            freelancerId: string;
            skillId: string;
            proficiency: number | null;
        })[];
    } & {
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
    }>;
    verify(id: string, isVerified: boolean): Promise<{
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
    }>;
}

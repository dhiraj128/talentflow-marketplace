import { MatchingEngineService } from './matching-engine.service';
export declare class MatchingEngineController {
    private readonly matchingEngineService;
    constructor(matchingEngineService: MatchingEngineService);
    calculateMatch(candidateId: string, jobId: string): Promise<{
        score: number;
        candidateId?: undefined;
        jobId?: undefined;
    } | {
        candidateId: string;
        jobId: string;
        score: number;
    }>;
    getRecommendedJobs(candidateId: string): Promise<{
        matchScore: number;
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
    }[]>;
    getRecommendedCandidates(jobId: string): Promise<{
        matchScore: number;
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
            candidateId: string;
            skillId: string;
            proficiency: number | null;
        })[];
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
    }[]>;
}

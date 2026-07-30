import { PrismaService } from '../prisma/prisma.service';
export declare class AnalyticsService {
    private prisma;
    constructor(prisma: PrismaService);
    getPlatformStats(): Promise<{
        totalJobs: number;
        totalEmployers: number;
        totalFreelancers: number;
        totalCourses: number;
        totalCandidates: number;
    }>;
    getCandidateDashboard(userId: string): Promise<{
        stats: {
            activeApplications: number;
            savedJobs: number;
            resumeViews: number;
            recruiterInvites: number;
        };
        metrics: {
            jobMatchScore: number;
            profileCompletion: number;
            recentlyViewed: number;
        };
        recentApplications: never[];
        recommendedJobs: never[];
        recommendedCourses: never[];
        upcomingInterviews: never[];
        recentActivity: never[];
    } | {
        stats: {
            activeApplications: number;
            savedJobs: number;
            resumeViews: number;
            recruiterInvites: number;
        };
        metrics: {
            jobMatchScore: number;
            profileCompletion: number;
            recentlyViewed: number;
            missingProfileItems: {
                label: string;
                actionHref: string;
            }[];
        };
        recentApplications: ({
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
        recommendedJobs: {
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
            requiredSkills: {
                jobId: string;
                skillId: string;
                isMandatory: boolean;
            }[];
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
        }[];
        recommendedCourses: {
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
        }[];
        upcomingInterviews: never[];
        recentActivity: never[];
    }>;
    private emptyCandidateDashboard;
    getEmployerDashboard(userId: string): Promise<{
        stats: {
            totalJobs: number;
            activeJobs: number;
            draftJobs: number;
            closedJobs: number;
            totalApplications: number;
            shortlisted: number;
            interviewsScheduled: number;
            hiredCandidates: number;
        };
        recentJobs: {
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
        }[];
        recentApplications: ({
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
        recommendedCandidates: {
            matchScore: number;
            matchedJobId: string | null;
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
            skills: {
                candidateId: string;
                skillId: string;
                proficiency: number | null;
            }[];
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
        }[];
    }>;
    private emptyEmployerDashboard;
    getFreelancerDashboard(userId: string): Promise<{
        stats: {
            activeProjects: number;
            completedProjects: number;
            pendingBids: number;
            earnings: number;
            rating: string | number;
            profileCompletion: number;
            totalReviews: number;
        };
        projects: ({
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
            employerId: string;
            freelancerId: string;
            title: string;
            description: string;
            budget: number;
            status: import(".prisma/client").$Enums.ProjectRequestStatus;
            createdAt: Date;
            updatedAt: Date;
        })[];
        invitations: ({
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
            employerId: string;
            freelancerId: string;
            title: string;
            description: string;
            budget: number;
            status: import(".prisma/client").$Enums.ProjectRequestStatus;
            createdAt: Date;
            updatedAt: Date;
        })[];
        reviews: {
            id: string;
            employerId: string;
            freelancerId: string;
            projectRequestId: string;
            rating: number;
            text: string | null;
            createdAt: Date;
        }[];
        recentActivity: never[];
    }>;
    private emptyFreelancerDashboard;
    getTrainerDashboard(userId: string): Promise<{
        publishedCourses: number;
        draftCourses: number;
        totalStudents: number;
        revenue: number;
        courseRating: number;
        certificatesIssued: number;
        courseCompletionRate: number;
        recentCourses: {
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
        }[];
    }>;
    getAdminDashboard(): Promise<{
        stats: {
            totalUsers: number;
            activeJobSeekers: number;
            activeEmployers: number;
            activeFreelancers: number;
            activeTrainers: number;
            jobsPosted: number;
            pendingJobs: number;
            publishedJobs: number;
            courses: number;
            pendingCourses: number;
            totalApplications: number;
            premiumMembers: number;
            monthlyRevenue: number;
            activeCoupons: number;
            expiringSubscriptions: number;
            totalRevenue: number;
        };
        recentUsers: {
            email: string;
            role: import(".prisma/client").$Enums.Role;
            id: string;
            createdAt: Date;
            status: import(".prisma/client").$Enums.UserStatus;
        }[];
        recentJobs: ({
            employer: {
                companyName: string;
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
        })[];
        charts: {
            userGrowthData: never[];
            revenueData: never[];
        };
    }>;
}

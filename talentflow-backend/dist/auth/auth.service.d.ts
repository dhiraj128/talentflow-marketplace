import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { NotificationsService } from '../notifications/notifications.service';
export declare class AuthService {
    private readonly prisma;
    private readonly jwtService;
    private readonly notificationsService;
    constructor(prisma: PrismaService, jwtService: JwtService, notificationsService: NotificationsService);
    validateUser(identifier: string, pass: string): Promise<any>;
    validateOAuthUser(oauthUser: any): Promise<{
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
    }>;
    getProfile(userId: string): Promise<{
        profile: {
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
        } | {
            id: string;
            userId: string;
            fullName: string;
            bio: string | null;
            expertise: string | null;
            avatarUrl: string | null;
            rating: number | null;
            isVerified: boolean;
            createdAt: Date;
            updatedAt: Date;
        } | {
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
        } | ({
            certificates: ({
                course: {
                    trainer: {
                        id: string;
                        userId: string;
                        fullName: string;
                        bio: string | null;
                        expertise: string | null;
                        avatarUrl: string | null;
                        rating: number | null;
                        isVerified: boolean;
                        createdAt: Date;
                        updatedAt: Date;
                    };
                } & {
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
                };
            } & {
                id: string;
                candidateId: string;
                courseId: string;
                issuedAt: Date;
                certificateUrl: string | null;
            })[];
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
        }) | null;
        email: string;
        role: import(".prisma/client").$Enums.Role;
        isEmailVerified: boolean;
        id: string;
        createdAt: Date;
    }>;
    login(loginDto: LoginDto): Promise<{
        access_token: string;
        refresh_token: string;
        user: any;
    }>;
    loginOAuth(user: any): Promise<{
        access_token: string;
        refresh_token: string;
        user: any;
    }>;
    register(registerDto: RegisterDto): Promise<{
        access_token: string;
        refresh_token: string;
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
    }>;
    forgotPassword(identifier: string): Promise<{
        message: string;
        type: string;
    }>;
    resetPassword(identifier: string, code: string, newPassword: string): Promise<{
        message: string;
    }>;
    logout(userId: string): Promise<{
        success: boolean;
    }>;
    refreshToken(token: string): Promise<{
        access_token: string;
    }>;
}

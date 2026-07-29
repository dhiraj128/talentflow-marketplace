import { RefreshDto } from './dto/refresh.dto';
import type { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { OtpService } from './otp.service';
import { SendOtpDto, VerifyOtpDto, ForgotPasswordDto, ResetPasswordDto } from './dto/otp.dto';
export declare class AuthController {
    private readonly authService;
    private readonly otpService;
    constructor(authService: AuthService, otpService: OtpService);
    login(loginDto: LoginDto): Promise<{
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
    sendEmailOtp(dto: SendOtpDto): Promise<{
        message: string;
    }>;
    sendPhoneOtp(dto: SendOtpDto): Promise<{
        message: string;
    }>;
    verifyEmailOtp(dto: VerifyOtpDto): Promise<{
        message: string;
    }>;
    verifyPhoneOtp(dto: VerifyOtpDto): Promise<{
        message: string;
    }>;
    resendOtp(dto: SendOtpDto): Promise<{
        message: string;
    }>;
    forgotPassword(dto: ForgotPasswordDto): Promise<{
        message: string;
        type: string;
    }>;
    resetPassword(dto: ResetPasswordDto): Promise<{
        message: string;
    }>;
    logout(user: any): Promise<{
        success: boolean;
    }>;
    getProfile(user: any): Promise<{
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
    refresh(body: RefreshDto): Promise<{
        access_token: string;
    }>;
    googleAuth(req: Request): Promise<void>;
    googleAuthRedirect(req: Request, res: Response): Promise<void>;
    githubAuth(req: Request): Promise<void>;
    githubAuthRedirect(req: Request, res: Response): Promise<void>;
}

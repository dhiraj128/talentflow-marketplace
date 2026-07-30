import { PrismaService } from '../prisma/prisma.service';
import { OtpPurpose } from '@prisma/client';
import { ResendEmailProvider } from './providers/resend-email.provider';
export declare class OtpService {
    private readonly prisma;
    private readonly emailProvider;
    private readonly logger;
    constructor(prisma: PrismaService, emailProvider: ResendEmailProvider);
    private generateSecureCode;
    sendOtp(identifier: string, purpose: OtpPurpose, type: 'EMAIL' | 'PHONE'): Promise<{
        message: string;
    }>;
    verifyOtp(identifier: string, code: string, purpose: OtpPurpose): Promise<{
        message: string;
    }>;
    isVerifiedRecently(identifier: string, purpose: OtpPurpose): Promise<boolean>;
}

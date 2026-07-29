import { OtpPurpose } from '@prisma/client';
export declare class SendOtpDto {
    identifier: string;
    purpose: OtpPurpose;
}
export declare class VerifyOtpDto {
    identifier: string;
    code: string;
    purpose: OtpPurpose;
}
export declare class ForgotPasswordDto {
    identifier: string;
}
export declare class ResetPasswordDto {
    identifier: string;
    code: string;
    newPassword: string;
}

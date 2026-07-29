import { Role, VerificationMethod } from '@prisma/client';
export declare class RegisterDto {
    email?: string;
    phoneNumber?: string;
    countryCode?: string;
    verificationMethod?: VerificationMethod;
    password: string;
    role: Role;
    fullName?: string;
}

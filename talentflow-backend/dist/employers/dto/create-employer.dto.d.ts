import { SubscriptionTier } from '@prisma/client';
export declare class CreateEmployerDto {
    userId: string;
    companyName: string;
    industry?: string;
    logoUrl?: string;
    bio?: string;
    phone?: string;
    websiteUrl?: string;
    location?: string;
    subscription?: SubscriptionTier;
}
export declare class UpdateEmployerDto {
    companyName?: string;
    industry?: string;
    logoUrl?: string;
    bio?: string;
    phone?: string;
    websiteUrl?: string;
    location?: string;
    subscription?: SubscriptionTier;
}

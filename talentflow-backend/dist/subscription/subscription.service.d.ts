import { PrismaService } from '../prisma/prisma.service';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';
export declare class SubscriptionService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createSubscriptionDto: CreateSubscriptionDto): Promise<{
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
    }>;
    findAll(): import(".prisma/client").Prisma.PrismaPromise<{
        subscription: import(".prisma/client").$Enums.SubscriptionTier;
        id: string;
        companyName: string;
    }[]>;
    findOne(id: string): import(".prisma/client").Prisma.Prisma__EmployerProfileClient<{
        subscription: import(".prisma/client").$Enums.SubscriptionTier;
        id: string;
        companyName: string;
    } | null, null, import("@prisma/client/runtime/library").DefaultArgs>;
    update(id: string, updateSubscriptionDto: UpdateSubscriptionDto): import(".prisma/client").Prisma.Prisma__EmployerProfileClient<{
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
    }, never, import("@prisma/client/runtime/library").DefaultArgs> | null;
    remove(id: string): import(".prisma/client").Prisma.Prisma__EmployerProfileClient<{
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
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
}

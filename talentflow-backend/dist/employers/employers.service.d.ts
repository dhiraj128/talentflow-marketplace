import { PrismaService } from '../prisma/prisma.service';
import { CreateEmployerDto, UpdateEmployerDto } from './dto/create-employer.dto';
export declare class EmployersService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(createEmployerDto: CreateEmployerDto): import(".prisma/client").Prisma.Prisma__EmployerProfileClient<{
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
    findAll(skip?: number, take?: number): import(".prisma/client").Prisma.PrismaPromise<{
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
    }[]>;
    findOne(id: string, user?: any): Promise<{
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
    update(id: string, updateEmployerDto: UpdateEmployerDto, user?: any): Promise<{
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
    remove(id: string, user?: any): Promise<{
        success: boolean;
    }>;
}

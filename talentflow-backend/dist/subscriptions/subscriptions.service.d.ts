import { PrismaService } from '../prisma/prisma.service';
export declare class SubscriptionsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(data: any): import(".prisma/client").Prisma.Prisma__SubscriptionClient<{
        id: string;
        userId: string;
        planId: string;
        status: string;
        startDate: Date;
        endDate: Date;
        autoRenew: boolean;
        createdAt: Date;
        updatedAt: Date;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    findAll(filters?: any): Promise<{
        data: {
            id: string;
            userId: string;
            planId: string;
            status: string;
            startDate: Date;
            endDate: Date;
            autoRenew: boolean;
            createdAt: Date;
            updatedAt: Date;
        }[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    findOne(id: string): Promise<{
        id: string;
        userId: string;
        planId: string;
        status: string;
        startDate: Date;
        endDate: Date;
        autoRenew: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    update(id: string, data: any): Promise<{
        id: string;
        userId: string;
        planId: string;
        status: string;
        startDate: Date;
        endDate: Date;
        autoRenew: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    remove(id: string): Promise<{
        success: boolean;
    }>;
}

import { PrismaService } from '../prisma/prisma.service';
export declare class PlansService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(data: any): import(".prisma/client").Prisma.Prisma__PlanClient<{
        id: string;
        name: string;
        description: string | null;
        price: number;
        billingCycle: string;
        features: import(".prisma/client").Prisma.JsonValue;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    findAll(filters?: any): Promise<{
        data: {
            id: string;
            name: string;
            description: string | null;
            price: number;
            billingCycle: string;
            features: import(".prisma/client").Prisma.JsonValue;
            isActive: boolean;
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
        name: string;
        description: string | null;
        price: number;
        billingCycle: string;
        features: import(".prisma/client").Prisma.JsonValue;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    update(id: string, data: any): Promise<{
        id: string;
        name: string;
        description: string | null;
        price: number;
        billingCycle: string;
        features: import(".prisma/client").Prisma.JsonValue;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    remove(id: string): Promise<{
        success: boolean;
    }>;
}

import { PrismaService } from '../prisma/prisma.service';
export declare class CouponsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(data: any): import(".prisma/client").Prisma.Prisma__CouponClient<{
        id: string;
        code: string;
        discountType: string;
        discountValue: number;
        maxUses: number | null;
        usedCount: number;
        expiryDate: Date | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    findAll(filters?: any): Promise<{
        data: {
            id: string;
            code: string;
            discountType: string;
            discountValue: number;
            maxUses: number | null;
            usedCount: number;
            expiryDate: Date | null;
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
        code: string;
        discountType: string;
        discountValue: number;
        maxUses: number | null;
        usedCount: number;
        expiryDate: Date | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    update(id: string, data: any): Promise<{
        id: string;
        code: string;
        discountType: string;
        discountValue: number;
        maxUses: number | null;
        usedCount: number;
        expiryDate: Date | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    remove(id: string): Promise<{
        success: boolean;
    }>;
}

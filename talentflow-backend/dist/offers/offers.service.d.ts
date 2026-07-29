import { PrismaService } from '../prisma/prisma.service';
export declare class OffersService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(data: any): import(".prisma/client").Prisma.Prisma__OfferClient<{
        id: string;
        title: string;
        description: string | null;
        discount: number;
        bannerUrl: string | null;
        isActive: boolean;
        validUntil: Date | null;
        createdAt: Date;
        updatedAt: Date;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    findAll(filters?: any): Promise<{
        data: {
            id: string;
            title: string;
            description: string | null;
            discount: number;
            bannerUrl: string | null;
            isActive: boolean;
            validUntil: Date | null;
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
        title: string;
        description: string | null;
        discount: number;
        bannerUrl: string | null;
        isActive: boolean;
        validUntil: Date | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    update(id: string, data: any): Promise<{
        id: string;
        title: string;
        description: string | null;
        discount: number;
        bannerUrl: string | null;
        isActive: boolean;
        validUntil: Date | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    remove(id: string): Promise<{
        success: boolean;
    }>;
}

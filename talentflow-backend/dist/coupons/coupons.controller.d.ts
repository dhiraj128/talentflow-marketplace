import { CreateCouponsDto } from './dto/create.dto';
import { UpdateCouponsDto } from './dto/update.dto';
import { CouponsService } from './coupons.service';
export declare class CouponsController {
    private readonly couponsService;
    constructor(couponsService: CouponsService);
    create(createDto: CreateCouponsDto): import(".prisma/client").Prisma.Prisma__CouponClient<{
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
    findAll(): Promise<{
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
    update(id: string, updateDto: UpdateCouponsDto): Promise<{
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

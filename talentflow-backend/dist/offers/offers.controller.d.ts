import { CreateOffersDto } from './dto/create.dto';
import { UpdateOffersDto } from './dto/update.dto';
import { OffersService } from './offers.service';
export declare class OffersController {
    private readonly offersService;
    constructor(offersService: OffersService);
    create(createDto: CreateOffersDto): import(".prisma/client").Prisma.Prisma__OfferClient<{
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
    findAll(): Promise<{
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
    update(id: string, updateDto: UpdateOffersDto): Promise<{
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

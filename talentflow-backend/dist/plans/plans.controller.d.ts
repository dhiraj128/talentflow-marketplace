import { CreatePlansDto } from './dto/create.dto';
import { UpdatePlansDto } from './dto/update.dto';
import { PlansService } from './plans.service';
export declare class PlansController {
    private readonly plansService;
    constructor(plansService: PlansService);
    create(createDto: CreatePlansDto): import(".prisma/client").Prisma.Prisma__PlanClient<{
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
    findAll(): Promise<{
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
    update(id: string, updateDto: UpdatePlansDto): Promise<{
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

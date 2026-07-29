import { CreateSubscriptionsDto } from './dto/create.dto';
import { UpdateSubscriptionsDto } from './dto/update.dto';
import { SubscriptionsService } from './subscriptions.service';
export declare class SubscriptionsController {
    private readonly subscriptionsService;
    constructor(subscriptionsService: SubscriptionsService);
    create(createDto: CreateSubscriptionsDto): import(".prisma/client").Prisma.Prisma__SubscriptionClient<{
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
    findAll(): Promise<{
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
    update(id: string, updateDto: UpdateSubscriptionsDto): Promise<{
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

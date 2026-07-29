import { CreateDesignationsDto } from './dto/create.dto';
import { UpdateDesignationsDto } from './dto/update.dto';
import { DesignationsService } from './designations.service';
export declare class DesignationsController {
    private readonly designationsService;
    constructor(designationsService: DesignationsService);
    create(createDto: CreateDesignationsDto): import(".prisma/client").Prisma.Prisma__DesignationClient<{
        id: string;
        name: string;
        description: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    findAll(): Promise<{
        data: {
            id: string;
            name: string;
            description: string | null;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
        }[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    findOne(id: string): import(".prisma/client").Prisma.Prisma__DesignationClient<{
        id: string;
        name: string;
        description: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    } | null, null, import("@prisma/client/runtime/library").DefaultArgs>;
    update(id: string, updateDto: UpdateDesignationsDto): import(".prisma/client").Prisma.Prisma__DesignationClient<{
        id: string;
        name: string;
        description: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    remove(id: string): import(".prisma/client").Prisma.Prisma__DesignationClient<{
        id: string;
        name: string;
        description: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
}

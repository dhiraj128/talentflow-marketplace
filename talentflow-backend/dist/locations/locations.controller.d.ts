import { CreateLocationsDto } from './dto/create.dto';
import { UpdateLocationsDto } from './dto/update.dto';
import { LocationsService } from './locations.service';
export declare class LocationsController {
    private readonly locationsService;
    constructor(locationsService: LocationsService);
    create(createDto: CreateLocationsDto): import(".prisma/client").Prisma.Prisma__LocationClient<{
        id: string;
        name: string;
        country: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    findAll(): Promise<{
        data: {
            id: string;
            name: string;
            country: string | null;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
        }[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    findOne(id: string): import(".prisma/client").Prisma.Prisma__LocationClient<{
        id: string;
        name: string;
        country: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    } | null, null, import("@prisma/client/runtime/library").DefaultArgs>;
    update(id: string, updateDto: UpdateLocationsDto): import(".prisma/client").Prisma.Prisma__LocationClient<{
        id: string;
        name: string;
        country: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    remove(id: string): import(".prisma/client").Prisma.Prisma__LocationClient<{
        id: string;
        name: string;
        country: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
}

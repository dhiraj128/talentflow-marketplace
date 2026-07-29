import { CreateSkillsDto } from './dto/create.dto';
import { UpdateSkillsDto } from './dto/update.dto';
import { SkillsService } from './skills.service';
export declare class SkillsController {
    private readonly skillsService;
    constructor(skillsService: SkillsService);
    create(createDto: CreateSkillsDto): import(".prisma/client").Prisma.Prisma__SkillClient<{
        id: string;
        name: string;
        category: string | null;
        createdAt: Date;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    findAll(): Promise<{
        data: {
            id: string;
            name: string;
            category: string | null;
            createdAt: Date;
        }[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    findOne(id: string): import(".prisma/client").Prisma.Prisma__SkillClient<{
        id: string;
        name: string;
        category: string | null;
        createdAt: Date;
    } | null, null, import("@prisma/client/runtime/library").DefaultArgs>;
    update(id: string, updateDto: UpdateSkillsDto): import(".prisma/client").Prisma.Prisma__SkillClient<{
        id: string;
        name: string;
        category: string | null;
        createdAt: Date;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    remove(id: string): import(".prisma/client").Prisma.Prisma__SkillClient<{
        id: string;
        name: string;
        category: string | null;
        createdAt: Date;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
}

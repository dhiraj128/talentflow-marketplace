import { PrismaService } from '../prisma/prisma.service';
export declare class SkillsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(data: any): import(".prisma/client").Prisma.Prisma__SkillClient<{
        id: string;
        name: string;
        category: string | null;
        createdAt: Date;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    findAll(filters?: any): Promise<{
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
    update(id: string, data: any): import(".prisma/client").Prisma.Prisma__SkillClient<{
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

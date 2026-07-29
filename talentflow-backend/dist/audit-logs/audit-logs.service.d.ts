import { PrismaService } from '../prisma/prisma.service';
import { CreateAuditLogDto } from './dto/create-audit-log.dto';
import { UpdateAuditLogDto } from './dto/update-audit-log.dto';
export declare class AuditLogsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createAuditLogDto: CreateAuditLogDto): import(".prisma/client").Prisma.Prisma__AuditLogClient<{
        id: string;
        actionBy: string;
        action: string;
        resource: string;
        details: import(".prisma/client").Prisma.JsonValue | null;
        createdAt: Date;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    findAll(skip?: number, take?: number): import(".prisma/client").Prisma.PrismaPromise<{
        id: string;
        actionBy: string;
        action: string;
        resource: string;
        details: import(".prisma/client").Prisma.JsonValue | null;
        createdAt: Date;
    }[]>;
    findOne(id: string): import(".prisma/client").Prisma.Prisma__AuditLogClient<{
        id: string;
        actionBy: string;
        action: string;
        resource: string;
        details: import(".prisma/client").Prisma.JsonValue | null;
        createdAt: Date;
    } | null, null, import("@prisma/client/runtime/library").DefaultArgs>;
    update(id: string, updateAuditLogDto: UpdateAuditLogDto): import(".prisma/client").Prisma.Prisma__AuditLogClient<{
        id: string;
        actionBy: string;
        action: string;
        resource: string;
        details: import(".prisma/client").Prisma.JsonValue | null;
        createdAt: Date;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    remove(id: string): import(".prisma/client").Prisma.Prisma__AuditLogClient<{
        id: string;
        actionBy: string;
        action: string;
        resource: string;
        details: import(".prisma/client").Prisma.JsonValue | null;
        createdAt: Date;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
}

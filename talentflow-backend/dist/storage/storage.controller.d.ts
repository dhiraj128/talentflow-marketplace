import type { Response, Request } from 'express';
import { AbstractStorageService } from './storage.service';
import { PrismaService } from '../prisma/prisma.service';
export declare class StorageController {
    private readonly prisma;
    private readonly storageService;
    constructor(prisma: PrismaService, storageService: AbstractStorageService);
    serveFile(req: Request, res: Response, user: any): Promise<void>;
}

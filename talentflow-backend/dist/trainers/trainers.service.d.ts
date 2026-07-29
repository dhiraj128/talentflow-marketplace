import { PrismaService } from '../prisma/prisma.service';
export declare class TrainersService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAll(): import(".prisma/client").Prisma.PrismaPromise<{
        id: string;
        userId: string;
        fullName: string;
        bio: string | null;
        expertise: string | null;
        avatarUrl: string | null;
        rating: number | null;
        isVerified: boolean;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    findOne(id: string, user?: any): Promise<{
        id: string;
        userId: string;
        fullName: string;
        bio: string | null;
        expertise: string | null;
        avatarUrl: string | null;
        rating: number | null;
        isVerified: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    update(id: string, updateDto: any, user?: any): Promise<{
        id: string;
        userId: string;
        fullName: string;
        bio: string | null;
        expertise: string | null;
        avatarUrl: string | null;
        rating: number | null;
        isVerified: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    remove(id: string, user?: any): Promise<{
        success: boolean;
    }>;
}

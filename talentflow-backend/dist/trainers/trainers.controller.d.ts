import { UpdateTrainersDto } from './dto/update.dto';
import { TrainersService } from './trainers.service';
export declare class TrainersController {
    private readonly trainersService;
    constructor(trainersService: TrainersService);
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
    findOne(id: string, user: any): Promise<{
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
    update(id: string, updateDto: UpdateTrainersDto, user: any): Promise<{
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
    remove(id: string, user: any): Promise<{
        success: boolean;
    }>;
}

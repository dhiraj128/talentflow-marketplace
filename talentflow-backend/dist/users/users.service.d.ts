import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto, UpdateUserDto } from './dto/create-user.dto';
export declare class UsersService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(createUserDto: CreateUserDto): Promise<{
        id: string;
        email: string;
        role: import(".prisma/client").$Enums.Role;
        isEmailVerified: boolean;
        phoneVerified: boolean;
        phoneNumber: string | null;
        countryCode: string | null;
        verificationMethod: import(".prisma/client").$Enums.VerificationMethod | null;
        refreshToken: string | null;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        avatarUrl: string | null;
        githubId: string | null;
        googleId: string | null;
        provider: string | null;
        status: import(".prisma/client").$Enums.UserStatus;
    }>;
    findAll(skip?: number, take?: number): Promise<{
        email: string;
        role: import(".prisma/client").$Enums.Role;
        isEmailVerified: boolean;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.UserStatus;
    }[]>;
    findOne(id: string): Promise<{
        email: string;
        role: import(".prisma/client").$Enums.Role;
        isEmailVerified: boolean;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.UserStatus;
    }>;
    update(id: string, updateUserDto: UpdateUserDto): Promise<{
        id: string;
        email: string;
        role: import(".prisma/client").$Enums.Role;
        isEmailVerified: boolean;
        phoneVerified: boolean;
        phoneNumber: string | null;
        countryCode: string | null;
        verificationMethod: import(".prisma/client").$Enums.VerificationMethod | null;
        refreshToken: string | null;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        avatarUrl: string | null;
        githubId: string | null;
        googleId: string | null;
        provider: string | null;
        status: import(".prisma/client").$Enums.UserStatus;
    }>;
    updateStatus(id: string, status: 'ACTIVE' | 'SUSPENDED'): Promise<{
        id: string;
        email: string;
        role: import(".prisma/client").$Enums.Role;
        isEmailVerified: boolean;
        phoneVerified: boolean;
        phoneNumber: string | null;
        countryCode: string | null;
        verificationMethod: import(".prisma/client").$Enums.VerificationMethod | null;
        refreshToken: string | null;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        avatarUrl: string | null;
        githubId: string | null;
        googleId: string | null;
        provider: string | null;
        status: import(".prisma/client").$Enums.UserStatus;
    }>;
    remove(id: string): Promise<{
        success: boolean;
    }>;
}

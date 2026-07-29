import { Role } from '@prisma/client';
export declare class CreateUserDto {
    email: string;
    password: string;
    role: Role;
}
export declare class UpdateUserDto {
    email?: string;
    password?: string;
    isEmailVerified?: boolean;
}

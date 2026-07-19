import {
  IsEmail,
  IsEnum,
  IsString,
  MinLength,
  IsOptional,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Role, VerificationMethod } from '@prisma/client';

export class RegisterDto {
  @ApiProperty({ example: 'demo@newuser.com', required: false })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ example: '+919876543210', required: false })
  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @ApiProperty({ example: '+91', required: false })
  @IsOptional()
  @IsString()
  countryCode?: string;

  @ApiProperty({ enum: VerificationMethod, required: false })
  @IsOptional()
  @IsEnum(VerificationMethod)
  verificationMethod?: VerificationMethod;

  @ApiProperty({ example: 'Password@123' })
  @IsString()
  @MinLength(8)
  password: string;

  @ApiProperty({ enum: Role, example: Role.CANDIDATE })
  @IsEnum(Role)
  role: Role;

  @ApiProperty({ example: 'John Doe', required: false })
  @IsOptional()
  @IsString()
  fullName?: string;
}

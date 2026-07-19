import { IsNotEmpty, IsString, Length, IsEnum, MinLength } from 'class-validator';
import { OtpPurpose } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class SendOtpDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  identifier: string;

  @ApiProperty({ enum: OtpPurpose })
  @IsEnum(OtpPurpose)
  purpose: OtpPurpose;
}

export class VerifyOtpDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  identifier: string;

  @ApiProperty()
  @IsString()
  @Length(6, 6)
  code: string;

  @ApiProperty({ enum: OtpPurpose })
  @IsEnum(OtpPurpose)
  purpose: OtpPurpose;
}

export class ForgotPasswordDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  identifier: string;
}

export class ResetPasswordDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  identifier: string;

  @ApiProperty()
  @IsString()
  @Length(6, 6)
  code: string;

  @ApiProperty()
  @IsString()
  @MinLength(8)
  newPassword: string;
}

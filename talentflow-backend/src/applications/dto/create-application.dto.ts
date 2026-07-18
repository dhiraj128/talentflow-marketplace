import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsEnum, IsUUID, IsInt } from 'class-validator';
import { ApplicationStatus } from '@prisma/client';

export class CreateApplicationDto {
  @ApiProperty()
  @IsUUID()
  candidateId: string;

  @ApiProperty()
  @IsUUID()
  jobId: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  resumeId?: string;

  @ApiPropertyOptional({ enum: ApplicationStatus })
  @IsOptional()
  @IsEnum(ApplicationStatus)
  status?: ApplicationStatus;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  matchScore?: number;
}

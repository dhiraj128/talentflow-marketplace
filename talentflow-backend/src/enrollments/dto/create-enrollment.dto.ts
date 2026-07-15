import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsUUID, IsInt, IsOptional, IsDateString } from 'class-validator';

export class CreateEnrollmentDto {
  @ApiProperty()
  @IsUUID()
  candidateId: string;

  @ApiProperty()
  @IsUUID()
  courseId: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  progress?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  completedAt?: Date;
}

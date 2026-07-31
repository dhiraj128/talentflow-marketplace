import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsInt,
  IsDateString,
  IsUrl,
  IsUUID,
  Min,
  IsEnum,
} from 'class-validator';
import { InterviewType } from '@prisma/client';

export class CreateInterviewDto {
  @IsUUID()
  @IsNotEmpty()
  applicationId: string;

  @IsDateString()
  @IsNotEmpty()
  scheduledAt: string;

  @IsEnum(InterviewType)
  @IsOptional()
  type?: InterviewType;

  @IsInt()
  @Min(15)
  @IsOptional()
  duration?: number;

  @IsString()
  @IsOptional()
  timezone?: string;

  @IsString()
  @IsOptional()
  meetingProvider?: string;

  @IsUrl()
  @IsOptional()
  meetingUrl?: string;

  @IsString()
  @IsOptional()
  location?: string;

  @IsString()
  @IsOptional()
  instructions?: string;

  @IsString()
  @IsOptional()
  notes?: string;
}

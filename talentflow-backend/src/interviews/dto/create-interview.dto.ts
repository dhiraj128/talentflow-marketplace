import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsInt,
  IsDateString,
  IsUrl,
  IsUUID,
  Min,
} from 'class-validator';

export class CreateInterviewDto {
  @IsUUID()
  @IsNotEmpty()
  applicationId: string;

  @IsDateString()
  @IsNotEmpty()
  scheduledAt: string;

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
  notes?: string;
}

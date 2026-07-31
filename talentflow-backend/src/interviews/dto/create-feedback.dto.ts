import { IsInt, Min, Max, IsEnum, IsString, IsOptional } from 'class-validator';
import { InterviewRecommendation } from '@prisma/client';

export class CreateInterviewFeedbackDto {
  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;

  @IsEnum(InterviewRecommendation)
  recommendation: InterviewRecommendation;

  @IsString()
  @IsOptional()
  strengths?: string;

  @IsString()
  @IsOptional()
  concerns?: string;

  @IsString()
  @IsOptional()
  notes?: string;
}

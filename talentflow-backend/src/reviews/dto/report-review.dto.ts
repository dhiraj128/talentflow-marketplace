import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class ReportReviewDto {
  @IsString()
  @IsNotEmpty()
  reason: string;

  @IsString()
  @IsOptional()
  details?: string;
}

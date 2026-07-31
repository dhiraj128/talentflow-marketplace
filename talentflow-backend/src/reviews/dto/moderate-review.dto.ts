import { IsEnum } from 'class-validator';
import { ReviewStatus, ReviewReportStatus } from '@prisma/client';

export class ModerateReviewDto {
  @IsEnum(ReviewStatus)
  status: ReviewStatus;
}

export class ResolveReportDto {
  @IsEnum(ReviewReportStatus)
  status: ReviewReportStatus;
}

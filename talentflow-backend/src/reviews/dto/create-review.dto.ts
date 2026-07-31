import { IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, Max, Min } from 'class-validator';
import { ReviewRelationshipType } from '@prisma/client';

export class CreateReviewDto {
  @IsEnum(ReviewRelationshipType)
  relationshipType: ReviewRelationshipType;

  @IsString()
  @IsNotEmpty()
  relationshipId: string;

  @IsString()
  @IsOptional()
  subjectUserId?: string;

  @IsString()
  @IsOptional()
  courseId?: string;

  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;

  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsNotEmpty()
  comment: string;
}

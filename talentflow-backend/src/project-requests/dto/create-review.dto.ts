import {
  IsInt,
  Min,
  Max,
  IsString,
  IsOptional,
  IsNotEmpty,
} from 'class-validator';
export class CreateReviewDto {
  @IsInt()
  @Min(1)
  @Max(5)
  @IsNotEmpty()
  rating: number;
  @IsString()
  @IsOptional()
  text?: string;
}

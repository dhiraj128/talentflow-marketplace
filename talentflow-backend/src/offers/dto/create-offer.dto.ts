import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsDateString,
  IsUUID,
  Min,
} from 'class-validator';

export class CreateOfferDto {
  @IsUUID()
  @IsNotEmpty()
  applicationId: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsNumber()
  @Min(1)
  salaryAmount: number;

  @IsString()
  @IsOptional()
  salaryCurrency?: string;

  @IsString()
  @IsOptional()
  salaryPeriod?: string;

  @IsDateString()
  @IsNotEmpty()
  joiningDate: string;

  @IsString()
  @IsOptional()
  employmentType?: string;

  @IsString()
  @IsOptional()
  workLocation?: string;

  @IsString()
  @IsOptional()
  message?: string;

  @IsDateString()
  @IsOptional()
  expiresAt?: string;

  @IsString()
  @IsOptional()
  status?: string; // DRAFT or SENT
}

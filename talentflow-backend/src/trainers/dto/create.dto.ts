import { IsOptional, IsString, IsNumber, IsBoolean } from 'class-validator';
export class CreateTrainersDto {
  @IsOptional() @IsString() name?: string;
  @IsOptional() @IsString() code?: string;
  @IsOptional() @IsString() title?: string;
  @IsOptional() @IsString() description?: string;
  @IsOptional() @IsNumber() discount?: number;
  @IsOptional() @IsBoolean() isActive?: boolean;
}
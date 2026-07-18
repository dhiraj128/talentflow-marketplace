import { IsOptional, IsString, IsNumber, IsBoolean } from 'class-validator';
export class CreateDesignationsDto {
  @IsOptional() @IsString() name?: string;
  @IsOptional() @IsString() code?: string;
  @IsOptional() @IsString() title?: string;
  @IsOptional() @IsString() description?: string;
  @IsOptional() @IsNumber() discount?: number;
  @IsOptional() @IsBoolean() isActive?: boolean;
}
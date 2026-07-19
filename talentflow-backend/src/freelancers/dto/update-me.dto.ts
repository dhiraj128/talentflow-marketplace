import { IsOptional, IsString } from 'class-validator';
export class UpdateMeDto {
  @IsOptional() @IsString() title?: string;
  @IsOptional() @IsString() bio?: string;
}

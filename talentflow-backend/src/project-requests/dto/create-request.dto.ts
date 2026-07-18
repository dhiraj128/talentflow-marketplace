import { IsUUID, IsString, IsNumber, IsNotEmpty } from 'class-validator';
export class CreateProjectRequestDto {
  @IsUUID()
  @IsNotEmpty()
  freelancerId: string;
  @IsString()
  @IsNotEmpty()
  title: string;
  @IsString()
  @IsNotEmpty()
  description: string;
  @IsNumber()
  @IsNotEmpty()
  budget: number;
}

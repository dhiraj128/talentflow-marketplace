import { IsOptional, IsString, IsNumber, IsArray } from 'class-validator';
export class CreateModuleDto {
  @IsString() title: string;
  @IsOptional() @IsString() description?: string;
}
export class CreateLessonDto {
  @IsString() title: string;
  @IsOptional() @IsString() content?: string;
  @IsOptional() @IsString() videoUrl?: string;
}
export class CreateAssessmentDto {
  @IsString() title: string;
}
export class CreateQuestionDto {
  @IsString() text: string;
  @IsArray() options: any[];
}
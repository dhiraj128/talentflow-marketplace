import { PartialType } from '@nestjs/swagger';
import { CreateInterviewDto } from './create-interview.dto';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { InterviewStatus } from '@prisma/client';

export class UpdateInterviewDto extends PartialType(CreateInterviewDto) {
  @IsEnum(InterviewStatus)
  @IsOptional()
  status?: InterviewStatus;

  @IsString()
  @IsOptional()
  feedback?: string;
}

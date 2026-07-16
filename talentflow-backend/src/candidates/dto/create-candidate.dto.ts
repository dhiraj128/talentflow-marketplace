import { IsString, IsOptional, IsUrl, IsArray, IsObject } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCandidateDto {
  @ApiProperty()
  @IsString()
  userId: string;

  @ApiProperty()
  @IsString()
  fullName: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  title?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  location?: string;

  @ApiPropertyOptional()
  @IsUrl()
  @IsOptional()
  avatarUrl?: string;

  @ApiPropertyOptional()
  @IsUrl()
  @IsOptional()
  resumeUrl?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  bio?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiPropertyOptional()
  @IsUrl()
  @IsOptional()
  portfolioUrl?: string;

  @ApiPropertyOptional()
  @IsUrl()
  @IsOptional()
  githubUrl?: string;

  @ApiPropertyOptional()
  @IsUrl()
  @IsOptional()
  linkedinUrl?: string;

  @ApiPropertyOptional()
  @IsArray()
  @IsOptional()
  experience?: any;

  @ApiPropertyOptional()
  @IsArray()
  @IsOptional()
  education?: any;
}

export class UpdateCandidateDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  fullName?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  title?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  location?: string;

  @ApiPropertyOptional()
  @IsUrl()
  @IsOptional()
  avatarUrl?: string;

  @ApiPropertyOptional()
  @IsUrl()
  @IsOptional()
  resumeUrl?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  bio?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiPropertyOptional()
  @IsUrl()
  @IsOptional()
  portfolioUrl?: string;

  @ApiPropertyOptional()
  @IsUrl()
  @IsOptional()
  githubUrl?: string;

  @ApiPropertyOptional()
  @IsUrl()
  @IsOptional()
  linkedinUrl?: string;

  @ApiPropertyOptional()
  @IsArray()
  @IsOptional()
  experience?: any;

  @ApiPropertyOptional()
  @IsArray()
  @IsOptional()
  education?: any;
}

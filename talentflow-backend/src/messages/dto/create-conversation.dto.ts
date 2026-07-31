import { IsUUID, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateConversationDto {
  @IsUUID()
  @IsNotEmpty()
  participant1Id: string;

  @IsUUID()
  @IsNotEmpty()
  participant2Id: string;

  @IsOptional()
  @IsString()
  applicationId?: string;

  @IsOptional()
  @IsString()
  jobId?: string;

  @IsOptional()
  @IsString()
  candidateInvitationId?: string;

  @IsOptional()
  @IsString()
  interviewId?: string;

  @IsOptional()
  @IsString()
  offerId?: string;
}

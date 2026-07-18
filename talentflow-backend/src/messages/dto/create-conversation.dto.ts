import { IsUUID, IsNotEmpty } from 'class-validator';
export class CreateConversationDto {
  @IsUUID()
  @IsNotEmpty()
  participant1Id: string;
  @IsUUID()
  @IsNotEmpty()
  participant2Id: string;
}

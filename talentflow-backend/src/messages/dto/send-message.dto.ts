import { IsUUID, IsString, IsNotEmpty } from 'class-validator';
export class SendMessageDto {
  @IsUUID()
  @IsNotEmpty()
  conversationId: string;
  @IsUUID()
  @IsNotEmpty()
  senderId: string;
  @IsString()
  @IsNotEmpty()
  content: string;
}

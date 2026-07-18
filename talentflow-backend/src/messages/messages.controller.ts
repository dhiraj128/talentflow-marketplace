import { CreateConversationDto } from './dto/create-conversation.dto';
import { SendMessageDto } from './dto/send-message.dto';
import { Controller, Get, Post, Body, Param, Query, UseGuards, Patch } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@ApiTags('messages')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Get('conversations')
  getConversations(@Query('userId') userId: string) {
    return this.messagesService.getConversations(userId);
  }

  @Post('conversations')
  createConversation(@Body() data: CreateConversationDto) {
    return this.messagesService.createConversation(data.participant1Id, data.participant2Id);
  }

  @Get('conversations/:id')
  getMessages(@Param('id') conversationId: string) {
    return this.messagesService.getMessages(conversationId);
  }

  @Post()
  sendMessage(@Body() data: SendMessageDto) {
    return this.messagesService.sendMessage(data.conversationId, data.senderId, data.content);
  }

  @Patch(':id/read')
  markAsRead(@Param('id') id: string) {
    return this.messagesService.markAsRead(id);
  }
}


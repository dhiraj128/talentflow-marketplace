import { CreateConversationDto } from './dto/create-conversation.dto';
import { SendMessageDto } from './dto/send-message.dto';
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  Patch,
} from '@nestjs/common';
import { MessagesService } from './messages.service';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('messages')
@ApiBearerAuth()
@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Get('conversations')
  @UseGuards(JwtAuthGuard)
  getConversations(@Query('userId') queryUserId: string, @CurrentUser() user: any) {
    const targetUserId = queryUserId || user.sub || user.userId;
    return this.messagesService.getConversations(targetUserId, user);
  }

  @Post('conversations')
  @UseGuards(JwtAuthGuard)
  createConversation(@Body() data: CreateConversationDto, @CurrentUser() user: any) {
    return this.messagesService.createConversation(data, user);
  }

  @Get('unread-count')
  @UseGuards(JwtAuthGuard)
  getUnreadCount(@CurrentUser() user: any) {
    return this.messagesService.getUnreadCount(user);
  }

  @Get('conversations/:id')
  @UseGuards(JwtAuthGuard)
  getMessages(@Param('id') conversationId: string, @CurrentUser() user: any) {
    return this.messagesService.getMessages(conversationId, user);
  }

  @Patch('conversations/:id/archive')
  @UseGuards(JwtAuthGuard)
  archiveConversation(@Param('id') conversationId: string, @CurrentUser() user: any) {
    return this.messagesService.archiveConversation(conversationId, user);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  sendMessage(@Body() data: SendMessageDto, @CurrentUser() user: any) {
    return this.messagesService.sendMessage(data, user);
  }

  @Patch(':id/read')
  @UseGuards(JwtAuthGuard)
  markAsRead(@Param('id') id: string, @CurrentUser() user: any) {
    return this.messagesService.markAsRead(id, user);
  }
}

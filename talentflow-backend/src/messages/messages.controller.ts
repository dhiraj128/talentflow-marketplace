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
import { Role } from "@prisma/client";
import { Roles } from "../common/decorators/roles.decorator";
import { RolesGuard } from "../common/guards/roles.guard";

@ApiTags('messages')
@ApiBearerAuth()
@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Get('conversations')
    @UseGuards(JwtAuthGuard)
  getConversations(@Query('userId') userId: string) {
    return this.messagesService.getConversations(userId);
  }

  @Post('conversations')
    @UseGuards(JwtAuthGuard)
  createConversation(@Body() data: CreateConversationDto) {
    return this.messagesService.createConversation(
      data.participant1Id,
      data.participant2Id,
    );
  }

  @Get('conversations/:id')
    @UseGuards(JwtAuthGuard)
  getMessages(@Param('id') conversationId: string) {
    return this.messagesService.getMessages(conversationId);
  }

  @Post()
    @UseGuards(JwtAuthGuard)
  sendMessage(@Body() data: SendMessageDto) {
    return this.messagesService.sendMessage(
      data.conversationId,
      data.senderId,
      data.content,
    );
  }

  @Patch(':id/read')
    @UseGuards(JwtAuthGuard)
  markAsRead(@Param('id') id: string) {
    return this.messagesService.markAsRead(id);
  }
}

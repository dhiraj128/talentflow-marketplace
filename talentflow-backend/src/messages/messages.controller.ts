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
import { CurrentUser } from "../common/decorators/current-user.decorator";

@ApiTags('messages')
@ApiTags('messages')
@ApiBearerAuth()
@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Get('conversations')
    @UseGuards(JwtAuthGuard)
  getConversations(@Query('userId') userId: string, @CurrentUser() user: any) {
    return this.messagesService.getConversations(userId, user);
  }

  @Post('conversations')
    @UseGuards(JwtAuthGuard)
  createConversation(@Body() data: CreateConversationDto, @CurrentUser() user: any) {
    return this.messagesService.createConversation(
      data.participant1Id,
      data.participant2Id,
      user
    );
  }

  @Get('conversations/:id')
    @UseGuards(JwtAuthGuard)
  getMessages(@Param('id') conversationId: string, @CurrentUser() user: any) {
    return this.messagesService.getMessages(conversationId, user);
  }

  @Post()
    @UseGuards(JwtAuthGuard)
  sendMessage(@Body() data: SendMessageDto, @CurrentUser() user: any) {
    return this.messagesService.sendMessage(
      data.conversationId,
      data.senderId,
      data.content,
      user
    );
  }

  @Patch(':id/read')
    @UseGuards(JwtAuthGuard)
  markAsRead(@Param('id') id: string, @CurrentUser() user: any) {
    return this.messagesService.markAsRead(id, user);
  }
}

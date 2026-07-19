import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MessagesService {
  constructor(private prisma: PrismaService) {}

  async getConversations(userId: string, user?: any) {
    if (user && user.role !== 'ADMIN' && userId !== (user.sub || user.userId)) throw new ForbiddenException('Forbidden');
    return this.prisma.conversation.findMany({
      where: {
        OR: [{ participant1Id: userId }, { participant2Id: userId }],
      },
      include: {
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
      orderBy: { updatedAt: 'desc' },
    });
  }

  async createConversation(participant1Id: string, participant2Id: string, user?: any) {
    if (user && user.role !== 'ADMIN' && participant1Id !== (user.sub || user.userId) && participant2Id !== (user.sub || user.userId)) throw new ForbiddenException('Forbidden');
    const existing = await this.prisma.conversation.findFirst({
      where: {
        OR: [
          { participant1Id, participant2Id },
          { participant1Id: participant2Id, participant2Id: participant1Id },
        ],
      },
    });
    if (existing) return existing;

    return this.prisma.conversation.create({
      data: {
        participant1Id,
        participant2Id,
      },
    });
  }

  async getMessages(conversationId: string, user?: any) {
    const conv = await this.prisma.conversation.findUnique({ where: { id: conversationId } });
    if (!conv) throw new NotFoundException('Conversation not found');
    if (user && user.role !== 'ADMIN' && conv.participant1Id !== (user.sub || user.userId) && conv.participant2Id !== (user.sub || user.userId)) throw new ForbiddenException('Forbidden');
    return this.prisma.message.findMany({
      where: { conversationId },
      orderBy: { createdAt: 'asc' },
      include: {
        sender: {
          select: {
            id: true,
            email: true,
            candidateProfile: { select: { fullName: true } },
            employerProfile: { select: { companyName: true } },
          },
        },
      },
    });
  }

  async sendMessage(conversationId: string, senderId: string, content: string, user?: any) {
    if (user && user.role !== 'ADMIN' && senderId !== (user.sub || user.userId)) throw new ForbiddenException('Forbidden');
    const message = await this.prisma.message.create({
      data: {
        conversationId,
        senderId,
        content,
      },
    });

    await this.prisma.conversation.update({
      where: { id: conversationId },
      data: { updatedAt: new Date() },
    });

    return message;
  }

  async markAsRead(id: string, user?: any) {
    const msg = await this.prisma.message.findUnique({ where: { id }, include: { conversation: true } });
    if (!msg) throw new NotFoundException('Message not found');
    if (user && user.role !== 'ADMIN' && msg.conversation.participant1Id !== (user.sub || user.userId) && msg.conversation.participant2Id !== (user.sub || user.userId)) throw new ForbiddenException('Forbidden');
    return this.prisma.message.update({
      where: { id },
      data: { isRead: true },
    });
  }
}

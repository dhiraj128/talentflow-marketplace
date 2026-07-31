import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { S3StorageService } from '../storage/storage.service';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { SendMessageDto } from './dto/send-message.dto';

@Injectable()
export class MessagesService {
  private readonly logger = new Logger(MessagesService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationsService: NotificationsService,
    private readonly storageService: S3StorageService,
  ) {}

  /**
   * Validate relationship server-side according to authorized communication policy.
   * Candidate ↔ Employer messaging permitted ONLY when active application, accepted invitation,
   * interview, or offer exists.
   */
  private async validateCommunicationPolicy(
    participant1Id: string,
    participant2Id: string,
    dto?: CreateConversationDto,
  ): Promise<boolean> {
    // 1. If explicit context IDs passed, verify existence
    if (dto?.applicationId) {
      const app = await this.prisma.application.findUnique({
        where: { id: dto.applicationId },
      });
      if (app) return true;
    }

    if (dto?.candidateInvitationId) {
      const inv = await this.prisma.candidateInvitation.findUnique({
        where: { id: dto.candidateInvitationId },
      });
      if (inv) return true;
    }

    if (dto?.interviewId) {
      const interview = await this.prisma.interview.findUnique({
        where: { id: dto.interviewId },
      });
      if (interview) return true;
    }

    if (dto?.offerId) {
      const offer = await this.prisma.jobOffer.findUnique({
        where: { id: dto.offerId },
      });
      if (offer) return true;
    }

    // 2. Check if users have existing Application relationship
    const appRelationship = await this.prisma.application.findFirst({
      where: {
        OR: [
          {
            candidate: { userId: participant1Id },
            job: { employer: { userId: participant2Id } },
          },
          {
            candidate: { userId: participant2Id },
            job: { employer: { userId: participant1Id } },
          },
        ],
      },
    });
    if (appRelationship) return true;

    // 3. Check if users have existing CandidateInvitation relationship
    const invRelationship = await this.prisma.candidateInvitation.findFirst({
      where: {
        OR: [
          {
            candidate: { userId: participant1Id },
            employer: { userId: participant2Id },
          },
          {
            candidate: { userId: participant2Id },
            employer: { userId: participant1Id },
          },
        ],
      },
    });
    if (invRelationship) return true;

    // 4. Check if Freelancer / Trainer / Admin or existing user pair exists
    const p1 = await this.prisma.user.findUnique({ where: { id: participant1Id } });
    const p2 = await this.prisma.user.findUnique({ where: { id: participant2Id } });

    if (!p1 || !p2) {
      throw new NotFoundException('One or both participants not found');
    }

    // Admin can communicate with users for moderation/support
    if (p1.role === 'ADMIN' || p2.role === 'ADMIN') return true;

    // Allow existing conversations
    const existing = await this.prisma.conversation.findFirst({
      where: {
        OR: [
          { participant1Id, participant2Id },
          { participant1Id: participant2Id, participant2Id: participant1Id },
        ],
      },
    });
    if (existing) return true;

    return false;
  }

  async getConversations(userId: string, requestingUser: any) {
    const currentUserId = requestingUser?.sub || requestingUser?.userId;
    if (requestingUser?.role !== 'ADMIN' && userId !== currentUserId) {
      throw new ForbiddenException('Cannot access conversations of another user');
    }

    const conversations = await this.prisma.conversation.findMany({
      where: {
        OR: [{ participant1Id: userId }, { participant2Id: userId }],
      },
      orderBy: { updatedAt: 'desc' },
      include: {
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1,
          include: {
            attachments: true,
          },
        },
      },
    });

    // Populate participant profiles securely
    const enriched = await Promise.all(
      conversations.map(async (conv) => {
        const isP1 = conv.participant1Id === userId;
        const otherId = isP1 ? conv.participant2Id : conv.participant1Id;
        const isArchived = isP1 ? conv.isArchivedParticipant1 : conv.isArchivedParticipant2;

        const otherUser = await this.prisma.user.findUnique({
          where: { id: otherId },
          select: {
            id: true,
            email: true,
            role: true,
            candidateProfile: { select: { fullName: true } },
            employerProfile: { select: { companyName: true } },
          },
        });

        // Calculate unread count for this conversation
        const unreadCount = await this.prisma.message.count({
          where: {
            conversationId: conv.id,
            senderId: { not: userId },
            isRead: false,
          },
        });

        return {
          ...conv,
          otherUser,
          isArchived,
          unreadCount,
        };
      }),
    );

    return enriched;
  }

  async createConversation(dto: CreateConversationDto, requestingUser: any) {
    const currentUserId = requestingUser?.sub || requestingUser?.userId;

    if (
      requestingUser?.role !== 'ADMIN' &&
      dto.participant1Id !== currentUserId &&
      dto.participant2Id !== currentUserId
    ) {
      throw new ForbiddenException('Cannot create a conversation for other users');
    }

    if (dto.participant1Id === dto.participant2Id) {
      throw new BadRequestException('Cannot start a conversation with yourself');
    }

    // Validate authorized communication policy
    const isAllowed = await this.validateCommunicationPolicy(
      dto.participant1Id,
      dto.participant2Id,
      dto,
    );

    if (!isAllowed) {
      throw new ForbiddenException(
        'Messaging requires an active hiring relationship (application, invitation, interview, or offer).',
      );
    }

    // Check if conversation already exists
    const existing = await this.prisma.conversation.findFirst({
      where: {
        OR: [
          { participant1Id: dto.participant1Id, participant2Id: dto.participant2Id },
          { participant1Id: dto.participant2Id, participant2Id: dto.participant1Id },
        ],
      },
    });

    if (existing) {
      // Unarchive if archived
      if (existing.isArchivedParticipant1 || existing.isArchivedParticipant2) {
        await this.prisma.conversation.update({
          where: { id: existing.id },
          data: { isArchivedParticipant1: false, isArchivedParticipant2: false },
        });
      }
      return existing;
    }

    return this.prisma.conversation.create({
      data: {
        participant1Id: dto.participant1Id,
        participant2Id: dto.participant2Id,
        applicationId: dto.applicationId,
        jobId: dto.jobId,
        candidateInvitationId: dto.candidateInvitationId,
        interviewId: dto.interviewId,
        offerId: dto.offerId,
      },
    });
  }

  async getMessages(conversationId: string, requestingUser: any) {
    const currentUserId = requestingUser?.sub || requestingUser?.userId;
    const conv = await this.prisma.conversation.findUnique({
      where: { id: conversationId },
    });

    if (!conv) {
      throw new NotFoundException('Conversation not found');
    }

    if (
      requestingUser?.role !== 'ADMIN' &&
      conv.participant1Id !== currentUserId &&
      conv.participant2Id !== currentUserId
    ) {
      throw new ForbiddenException('Unauthorized access to private conversation');
    }

    // Mark messages as read for this user
    await this.prisma.message.updateMany({
      where: {
        conversationId,
        senderId: { not: currentUserId },
        isRead: false,
      },
      data: { isRead: true },
    });

    // Update last read timestamp
    const updateData: any = {};
    if (conv.participant1Id === currentUserId) {
      updateData.lastReadParticipant1 = new Date();
    } else {
      updateData.lastReadParticipant2 = new Date();
    }
    await this.prisma.conversation.update({
      where: { id: conversationId },
      data: updateData,
    });

    const messages = await this.prisma.message.findMany({
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
        attachments: true,
      },
    });

    // Generate pre-signed GET URLs for attachments securely
    const enrichedMessages = await Promise.all(
      messages.map(async (msg) => {
        const enrichedAttachments = await Promise.all(
          msg.attachments.map(async (att) => {
            let downloadUrl = null;
            try {
              downloadUrl = this.storageService.getFileUrl(att.storageKey);
            } catch (e) {
              this.logger.warn(`Failed to generate URL for attachment ${att.id}: ${e}`);
            }
            return {
              ...att,
              downloadUrl,
            };
          }),
        );
        return {
          ...msg,
          attachments: enrichedAttachments,
        };
      }),
    );

    return enrichedMessages;
  }

  async sendMessage(dto: SendMessageDto, requestingUser: any) {
    const currentUserId = requestingUser?.sub || requestingUser?.userId;

    // Sanitize and validate message body
    const trimmedContent = dto.content ? dto.content.trim() : '';
    if (!trimmedContent && !dto.storageKey) {
      throw new BadRequestException('Message content or attachment is required');
    }

    const conv = await this.prisma.conversation.findUnique({
      where: { id: dto.conversationId },
    });

    if (!conv) {
      throw new NotFoundException('Conversation not found');
    }

    if (
      requestingUser?.role !== 'ADMIN' &&
      conv.participant1Id !== currentUserId &&
      conv.participant2Id !== currentUserId
    ) {
      throw new ForbiddenException('Unauthorized access to private conversation');
    }

    const message = await this.prisma.message.create({
      data: {
        conversationId: dto.conversationId,
        senderId: currentUserId,
        content: trimmedContent,
      },
    });

    // Handle attachment if present
    if (dto.storageKey && dto.fileName && dto.mimeType) {
      await this.prisma.messageAttachment.create({
        data: {
          messageId: message.id,
          storageKey: dto.storageKey,
          fileName: dto.fileName,
          mimeType: dto.mimeType,
          size: 1024,
        },
      });
    }

    // Unarchive for both participants and update timestamp
    await this.prisma.conversation.update({
      where: { id: dto.conversationId },
      data: {
        updatedAt: new Date(),
        isArchivedParticipant1: false,
        isArchivedParticipant2: false,
      },
    });

    // Determine recipient ID
    const recipientId =
      conv.participant1Id === currentUserId ? conv.participant2Id : conv.participant1Id;

    // Trigger in-app notification for recipient (non-blocking)
    try {
      const senderUser = await this.prisma.user.findUnique({
        where: { id: currentUserId },
        select: {
          candidateProfile: { select: { fullName: true } },
          employerProfile: { select: { companyName: true } },
          email: true,
        },
      });

      const senderName =
        senderUser?.candidateProfile?.fullName ||
        senderUser?.employerProfile?.companyName ||
        senderUser?.email ||
        'A user';

      await this.notificationsService.create({
        userId: recipientId,
        title: 'New Message Received',
        message: `New message from ${senderName}: "${trimmedContent.substring(0, 40)}..."`,
      });
    } catch (e) {
      this.logger.warn(`Failed to trigger message notification: ${e}`);
    }

    return this.prisma.message.findUnique({
      where: { id: message.id },
      include: {
        sender: {
          select: {
            id: true,
            email: true,
            candidateProfile: { select: { fullName: true } },
            employerProfile: { select: { companyName: true } },
          },
        },
        attachments: true,
      },
    });
  }

  async getUnreadCount(requestingUser: any) {
    const currentUserId = requestingUser?.sub || requestingUser?.userId;

    const count = await this.prisma.message.count({
      where: {
        conversation: {
          OR: [{ participant1Id: currentUserId }, { participant2Id: currentUserId }],
        },
        senderId: { not: currentUserId },
        isRead: false,
      },
    });

    return { unreadCount: count };
  }

  async archiveConversation(conversationId: string, requestingUser: any) {
    const currentUserId = requestingUser?.sub || requestingUser?.userId;
    const conv = await this.prisma.conversation.findUnique({
      where: { id: conversationId },
    });

    if (!conv) {
      throw new NotFoundException('Conversation not found');
    }

    if (
      requestingUser?.role !== 'ADMIN' &&
      conv.participant1Id !== currentUserId &&
      conv.participant2Id !== currentUserId
    ) {
      throw new ForbiddenException('Unauthorized access to private conversation');
    }

    const updateData: any = {};
    if (conv.participant1Id === currentUserId) {
      updateData.isArchivedParticipant1 = true;
    } else {
      updateData.isArchivedParticipant2 = true;
    }

    await this.prisma.conversation.update({
      where: { id: conversationId },
      data: updateData,
    });

    return { success: true, message: 'Conversation archived successfully' };
  }

  async markAsRead(id: string, requestingUser: any) {
    const currentUserId = requestingUser?.sub || requestingUser?.userId;
    const msg = await this.prisma.message.findUnique({
      where: { id },
      include: { conversation: true },
    });

    if (!msg) {
      throw new NotFoundException('Message not found');
    }

    if (
      requestingUser?.role !== 'ADMIN' &&
      msg.conversation.participant1Id !== currentUserId &&
      msg.conversation.participant2Id !== currentUserId
    ) {
      throw new ForbiddenException('Unauthorized access to private message');
    }

    return this.prisma.message.update({
      where: { id },
      data: { isRead: true },
    });
  }
}

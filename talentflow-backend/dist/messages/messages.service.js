"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var MessagesService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessagesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const notifications_service_1 = require("../notifications/notifications.service");
const storage_service_1 = require("../storage/storage.service");
let MessagesService = MessagesService_1 = class MessagesService {
    prisma;
    notificationsService;
    storageService;
    logger = new common_1.Logger(MessagesService_1.name);
    constructor(prisma, notificationsService, storageService) {
        this.prisma = prisma;
        this.notificationsService = notificationsService;
        this.storageService = storageService;
    }
    async validateCommunicationPolicy(participant1Id, participant2Id, dto) {
        if (dto?.applicationId) {
            const app = await this.prisma.application.findUnique({
                where: { id: dto.applicationId },
            });
            if (app)
                return true;
        }
        if (dto?.candidateInvitationId) {
            const inv = await this.prisma.candidateInvitation.findUnique({
                where: { id: dto.candidateInvitationId },
            });
            if (inv)
                return true;
        }
        if (dto?.interviewId) {
            const interview = await this.prisma.interview.findUnique({
                where: { id: dto.interviewId },
            });
            if (interview)
                return true;
        }
        if (dto?.offerId) {
            const offer = await this.prisma.jobOffer.findUnique({
                where: { id: dto.offerId },
            });
            if (offer)
                return true;
        }
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
        if (appRelationship)
            return true;
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
        if (invRelationship)
            return true;
        const p1 = await this.prisma.user.findUnique({ where: { id: participant1Id } });
        const p2 = await this.prisma.user.findUnique({ where: { id: participant2Id } });
        if (!p1 || !p2) {
            throw new common_1.NotFoundException('One or both participants not found');
        }
        if (p1.role === 'ADMIN' || p2.role === 'ADMIN')
            return true;
        const existing = await this.prisma.conversation.findFirst({
            where: {
                OR: [
                    { participant1Id, participant2Id },
                    { participant1Id: participant2Id, participant2Id: participant1Id },
                ],
            },
        });
        if (existing)
            return true;
        return false;
    }
    async getConversations(userId, requestingUser) {
        const currentUserId = requestingUser?.sub || requestingUser?.userId;
        if (requestingUser?.role !== 'ADMIN' && userId !== currentUserId) {
            throw new common_1.ForbiddenException('Cannot access conversations of another user');
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
        const enriched = await Promise.all(conversations.map(async (conv) => {
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
        }));
        return enriched;
    }
    async createConversation(dto, requestingUser) {
        const currentUserId = requestingUser?.sub || requestingUser?.userId;
        if (requestingUser?.role !== 'ADMIN' &&
            dto.participant1Id !== currentUserId &&
            dto.participant2Id !== currentUserId) {
            throw new common_1.ForbiddenException('Cannot create a conversation for other users');
        }
        if (dto.participant1Id === dto.participant2Id) {
            throw new common_1.BadRequestException('Cannot start a conversation with yourself');
        }
        const isAllowed = await this.validateCommunicationPolicy(dto.participant1Id, dto.participant2Id, dto);
        if (!isAllowed) {
            throw new common_1.ForbiddenException('Messaging requires an active hiring relationship (application, invitation, interview, or offer).');
        }
        const existing = await this.prisma.conversation.findFirst({
            where: {
                OR: [
                    { participant1Id: dto.participant1Id, participant2Id: dto.participant2Id },
                    { participant1Id: dto.participant2Id, participant2Id: dto.participant1Id },
                ],
            },
        });
        if (existing) {
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
    async getMessages(conversationId, requestingUser) {
        const currentUserId = requestingUser?.sub || requestingUser?.userId;
        const conv = await this.prisma.conversation.findUnique({
            where: { id: conversationId },
        });
        if (!conv) {
            throw new common_1.NotFoundException('Conversation not found');
        }
        if (requestingUser?.role !== 'ADMIN' &&
            conv.participant1Id !== currentUserId &&
            conv.participant2Id !== currentUserId) {
            throw new common_1.ForbiddenException('Unauthorized access to private conversation');
        }
        await this.prisma.message.updateMany({
            where: {
                conversationId,
                senderId: { not: currentUserId },
                isRead: false,
            },
            data: { isRead: true },
        });
        const updateData = {};
        if (conv.participant1Id === currentUserId) {
            updateData.lastReadParticipant1 = new Date();
        }
        else {
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
        const enrichedMessages = await Promise.all(messages.map(async (msg) => {
            const enrichedAttachments = await Promise.all(msg.attachments.map(async (att) => {
                let downloadUrl = null;
                try {
                    downloadUrl = this.storageService.getFileUrl(att.storageKey);
                }
                catch (e) {
                    this.logger.warn(`Failed to generate URL for attachment ${att.id}: ${e}`);
                }
                return {
                    ...att,
                    downloadUrl,
                };
            }));
            return {
                ...msg,
                attachments: enrichedAttachments,
            };
        }));
        return enrichedMessages;
    }
    async sendMessage(dto, requestingUser) {
        const currentUserId = requestingUser?.sub || requestingUser?.userId;
        const trimmedContent = dto.content ? dto.content.trim() : '';
        if (!trimmedContent && !dto.storageKey) {
            throw new common_1.BadRequestException('Message content or attachment is required');
        }
        const conv = await this.prisma.conversation.findUnique({
            where: { id: dto.conversationId },
        });
        if (!conv) {
            throw new common_1.NotFoundException('Conversation not found');
        }
        if (requestingUser?.role !== 'ADMIN' &&
            conv.participant1Id !== currentUserId &&
            conv.participant2Id !== currentUserId) {
            throw new common_1.ForbiddenException('Unauthorized access to private conversation');
        }
        const message = await this.prisma.message.create({
            data: {
                conversationId: dto.conversationId,
                senderId: currentUserId,
                content: trimmedContent,
            },
        });
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
        await this.prisma.conversation.update({
            where: { id: dto.conversationId },
            data: {
                updatedAt: new Date(),
                isArchivedParticipant1: false,
                isArchivedParticipant2: false,
            },
        });
        const recipientId = conv.participant1Id === currentUserId ? conv.participant2Id : conv.participant1Id;
        try {
            const senderUser = await this.prisma.user.findUnique({
                where: { id: currentUserId },
                select: {
                    candidateProfile: { select: { fullName: true } },
                    employerProfile: { select: { companyName: true } },
                    email: true,
                },
            });
            const senderName = senderUser?.candidateProfile?.fullName ||
                senderUser?.employerProfile?.companyName ||
                senderUser?.email ||
                'A user';
            await this.notificationsService.create({
                userId: recipientId,
                title: 'New Message Received',
                message: `New message from ${senderName}: "${trimmedContent.substring(0, 40)}..."`,
            });
        }
        catch (e) {
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
    async getUnreadCount(requestingUser) {
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
    async archiveConversation(conversationId, requestingUser) {
        const currentUserId = requestingUser?.sub || requestingUser?.userId;
        const conv = await this.prisma.conversation.findUnique({
            where: { id: conversationId },
        });
        if (!conv) {
            throw new common_1.NotFoundException('Conversation not found');
        }
        if (requestingUser?.role !== 'ADMIN' &&
            conv.participant1Id !== currentUserId &&
            conv.participant2Id !== currentUserId) {
            throw new common_1.ForbiddenException('Unauthorized access to private conversation');
        }
        const updateData = {};
        if (conv.participant1Id === currentUserId) {
            updateData.isArchivedParticipant1 = true;
        }
        else {
            updateData.isArchivedParticipant2 = true;
        }
        await this.prisma.conversation.update({
            where: { id: conversationId },
            data: updateData,
        });
        return { success: true, message: 'Conversation archived successfully' };
    }
    async markAsRead(id, requestingUser) {
        const currentUserId = requestingUser?.sub || requestingUser?.userId;
        const msg = await this.prisma.message.findUnique({
            where: { id },
            include: { conversation: true },
        });
        if (!msg) {
            throw new common_1.NotFoundException('Message not found');
        }
        if (requestingUser?.role !== 'ADMIN' &&
            msg.conversation.participant1Id !== currentUserId &&
            msg.conversation.participant2Id !== currentUserId) {
            throw new common_1.ForbiddenException('Unauthorized access to private message');
        }
        return this.prisma.message.update({
            where: { id },
            data: { isRead: true },
        });
    }
};
exports.MessagesService = MessagesService;
exports.MessagesService = MessagesService = MessagesService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        notifications_service_1.NotificationsService,
        storage_service_1.S3StorageService])
], MessagesService);
//# sourceMappingURL=messages.service.js.map
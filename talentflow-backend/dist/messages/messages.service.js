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
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessagesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let MessagesService = class MessagesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getConversations(userId, user) {
        if (user && user.role !== 'ADMIN' && userId !== (user.sub || user.userId))
            throw new common_1.ForbiddenException('Forbidden');
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
    async createConversation(participant1Id, participant2Id, user) {
        if (user && user.role !== 'ADMIN' && participant1Id !== (user.sub || user.userId) && participant2Id !== (user.sub || user.userId))
            throw new common_1.ForbiddenException('Forbidden');
        const existing = await this.prisma.conversation.findFirst({
            where: {
                OR: [
                    { participant1Id, participant2Id },
                    { participant1Id: participant2Id, participant2Id: participant1Id },
                ],
            },
        });
        if (existing)
            return existing;
        return this.prisma.conversation.create({
            data: {
                participant1Id,
                participant2Id,
            },
        });
    }
    async getMessages(conversationId, user) {
        const conv = await this.prisma.conversation.findUnique({ where: { id: conversationId } });
        if (!conv)
            throw new common_1.NotFoundException('Conversation not found');
        if (user && user.role !== 'ADMIN' && conv.participant1Id !== (user.sub || user.userId) && conv.participant2Id !== (user.sub || user.userId))
            throw new common_1.ForbiddenException('Forbidden');
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
    async sendMessage(conversationId, senderId, content, user) {
        if (user && user.role !== 'ADMIN' && senderId !== (user.sub || user.userId))
            throw new common_1.ForbiddenException('Forbidden');
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
    async markAsRead(id, user) {
        const msg = await this.prisma.message.findUnique({ where: { id }, include: { conversation: true } });
        if (!msg)
            throw new common_1.NotFoundException('Message not found');
        if (user && user.role !== 'ADMIN' && msg.conversation.participant1Id !== (user.sub || user.userId) && msg.conversation.participant2Id !== (user.sub || user.userId))
            throw new common_1.ForbiddenException('Forbidden');
        return this.prisma.message.update({
            where: { id },
            data: { isRead: true },
        });
    }
};
exports.MessagesService = MessagesService;
exports.MessagesService = MessagesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], MessagesService);
//# sourceMappingURL=messages.service.js.map
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { S3StorageService } from '../storage/storage.service';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { SendMessageDto } from './dto/send-message.dto';
export declare class MessagesService {
    private readonly prisma;
    private readonly notificationsService;
    private readonly storageService;
    private readonly logger;
    constructor(prisma: PrismaService, notificationsService: NotificationsService, storageService: S3StorageService);
    private validateCommunicationPolicy;
    getConversations(userId: string, requestingUser: any): Promise<{
        otherUser: {
            employerProfile: {
                companyName: string;
            } | null;
            candidateProfile: {
                fullName: string;
            } | null;
            email: string;
            role: import(".prisma/client").$Enums.Role;
            id: string;
        } | null;
        isArchived: boolean;
        unreadCount: number;
        messages: ({
            attachments: {
                id: string;
                messageId: string;
                storageKey: string;
                fileName: string;
                mimeType: string;
                size: number;
                createdAt: Date;
            }[];
        } & {
            id: string;
            conversationId: string;
            senderId: string;
            content: string;
            isRead: boolean;
            createdAt: Date;
        })[];
        id: string;
        participant1Id: string;
        participant2Id: string;
        applicationId: string | null;
        jobId: string | null;
        candidateInvitationId: string | null;
        interviewId: string | null;
        offerId: string | null;
        isArchivedParticipant1: boolean;
        isArchivedParticipant2: boolean;
        lastReadParticipant1: Date | null;
        lastReadParticipant2: Date | null;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    createConversation(dto: CreateConversationDto, requestingUser: any): Promise<{
        id: string;
        participant1Id: string;
        participant2Id: string;
        applicationId: string | null;
        jobId: string | null;
        candidateInvitationId: string | null;
        interviewId: string | null;
        offerId: string | null;
        isArchivedParticipant1: boolean;
        isArchivedParticipant2: boolean;
        lastReadParticipant1: Date | null;
        lastReadParticipant2: Date | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    getMessages(conversationId: string, requestingUser: any): Promise<{
        attachments: {
            downloadUrl: string | null;
            id: string;
            messageId: string;
            storageKey: string;
            fileName: string;
            mimeType: string;
            size: number;
            createdAt: Date;
        }[];
        sender: {
            employerProfile: {
                companyName: string;
            } | null;
            candidateProfile: {
                fullName: string;
            } | null;
            email: string;
            id: string;
        };
        id: string;
        conversationId: string;
        senderId: string;
        content: string;
        isRead: boolean;
        createdAt: Date;
    }[]>;
    sendMessage(dto: SendMessageDto, requestingUser: any): Promise<({
        attachments: {
            id: string;
            messageId: string;
            storageKey: string;
            fileName: string;
            mimeType: string;
            size: number;
            createdAt: Date;
        }[];
        sender: {
            employerProfile: {
                companyName: string;
            } | null;
            candidateProfile: {
                fullName: string;
            } | null;
            email: string;
            id: string;
        };
    } & {
        id: string;
        conversationId: string;
        senderId: string;
        content: string;
        isRead: boolean;
        createdAt: Date;
    }) | null>;
    getUnreadCount(requestingUser: any): Promise<{
        unreadCount: number;
    }>;
    archiveConversation(conversationId: string, requestingUser: any): Promise<{
        success: boolean;
        message: string;
    }>;
    markAsRead(id: string, requestingUser: any): Promise<{
        id: string;
        conversationId: string;
        senderId: string;
        content: string;
        isRead: boolean;
        createdAt: Date;
    }>;
}

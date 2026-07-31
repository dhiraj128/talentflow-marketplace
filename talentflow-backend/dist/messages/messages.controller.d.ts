import { CreateConversationDto } from './dto/create-conversation.dto';
import { SendMessageDto } from './dto/send-message.dto';
import { MessagesService } from './messages.service';
export declare class MessagesController {
    private readonly messagesService;
    constructor(messagesService: MessagesService);
    getConversations(queryUserId: string, user: any): Promise<{
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
    createConversation(data: CreateConversationDto, user: any): Promise<{
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
    getUnreadCount(user: any): Promise<{
        unreadCount: number;
    }>;
    getMessages(conversationId: string, user: any): Promise<{
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
    archiveConversation(conversationId: string, user: any): Promise<{
        success: boolean;
        message: string;
    }>;
    sendMessage(data: SendMessageDto, user: any): Promise<({
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
    markAsRead(id: string, user: any): Promise<{
        id: string;
        conversationId: string;
        senderId: string;
        content: string;
        isRead: boolean;
        createdAt: Date;
    }>;
}

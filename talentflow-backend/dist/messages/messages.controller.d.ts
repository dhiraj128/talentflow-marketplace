import { CreateConversationDto } from './dto/create-conversation.dto';
import { SendMessageDto } from './dto/send-message.dto';
import { MessagesService } from './messages.service';
export declare class MessagesController {
    private readonly messagesService;
    constructor(messagesService: MessagesService);
    getConversations(userId: string, user: any): Promise<({
        messages: {
            id: string;
            conversationId: string;
            senderId: string;
            content: string;
            isRead: boolean;
            createdAt: Date;
        }[];
    } & {
        id: string;
        participant1Id: string;
        participant2Id: string;
        createdAt: Date;
        updatedAt: Date;
    })[]>;
    createConversation(data: CreateConversationDto, user: any): Promise<{
        id: string;
        participant1Id: string;
        participant2Id: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    getMessages(conversationId: string, user: any): Promise<({
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
    })[]>;
    sendMessage(data: SendMessageDto, user: any): Promise<{
        id: string;
        conversationId: string;
        senderId: string;
        content: string;
        isRead: boolean;
        createdAt: Date;
    }>;
    markAsRead(id: string, user: any): Promise<{
        id: string;
        conversationId: string;
        senderId: string;
        content: string;
        isRead: boolean;
        createdAt: Date;
    }>;
}

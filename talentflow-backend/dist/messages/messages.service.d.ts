import { PrismaService } from '../prisma/prisma.service';
export declare class MessagesService {
    private prisma;
    constructor(prisma: PrismaService);
    getConversations(userId: string, user?: any): Promise<({
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
    createConversation(participant1Id: string, participant2Id: string, user?: any): Promise<{
        id: string;
        participant1Id: string;
        participant2Id: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    getMessages(conversationId: string, user?: any): Promise<({
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
    sendMessage(conversationId: string, senderId: string, content: string, user?: any): Promise<{
        id: string;
        conversationId: string;
        senderId: string;
        content: string;
        isRead: boolean;
        createdAt: Date;
    }>;
    markAsRead(id: string, user?: any): Promise<{
        id: string;
        conversationId: string;
        senderId: string;
        content: string;
        isRead: boolean;
        createdAt: Date;
    }>;
}

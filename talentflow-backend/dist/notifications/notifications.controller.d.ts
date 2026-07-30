import { NotificationsService } from './notifications.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
export declare class NotificationsController {
    private readonly notificationsService;
    constructor(notificationsService: NotificationsService);
    create(createNotificationDto: CreateNotificationDto): Promise<{
        id: string;
        userId: string;
        title: string;
        message: string;
        isRead: boolean;
        createdAt: Date;
    }>;
    findAll(user: any, page?: string, limit?: string, unreadOnly?: string): Promise<{
        data: {
            id: string;
            userId: string;
            title: string;
            message: string;
            isRead: boolean;
            createdAt: Date;
        }[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
        unreadCount: number;
    }>;
    getUnreadCount(user: any): Promise<{
        count: number;
    }>;
    markAllAsRead(user: any): Promise<{
        success: boolean;
        count: number;
    }>;
    markAsRead(id: string, user: any): Promise<{
        id: string;
        userId: string;
        title: string;
        message: string;
        isRead: boolean;
        createdAt: Date;
    }>;
    findOne(id: string, user: any): Promise<{
        id: string;
        userId: string;
        title: string;
        message: string;
        isRead: boolean;
        createdAt: Date;
    }>;
    update(id: string, updateNotificationDto: UpdateNotificationDto, user: any): Promise<{
        id: string;
        userId: string;
        title: string;
        message: string;
        isRead: boolean;
        createdAt: Date;
    }>;
    remove(id: string, user: any): Promise<{
        success: boolean;
        message: string;
    }>;
}

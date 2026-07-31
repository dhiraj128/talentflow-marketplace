import { PrismaService } from '../prisma/prisma.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { ResendEmailProvider } from '../auth/providers/resend-email.provider';
export declare class NotificationsService {
    private prisma;
    private emailProvider;
    private readonly logger;
    constructor(prisma: PrismaService, emailProvider: ResendEmailProvider);
    create(createNotificationDto: CreateNotificationDto): Promise<{
        id: string;
        userId: string;
        title: string;
        message: string;
        isRead: boolean;
        createdAt: Date;
    }>;
    findAllForUser(userId: string, options?: {
        page?: number;
        limit?: number;
        unreadOnly?: boolean;
    }): Promise<{
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
    getUnreadCount(userId: string): Promise<{
        count: number;
    }>;
    findOneForUser(id: string, userId: string): Promise<{
        id: string;
        userId: string;
        title: string;
        message: string;
        isRead: boolean;
        createdAt: Date;
    }>;
    markAsRead(id: string, userId: string): Promise<{
        id: string;
        userId: string;
        title: string;
        message: string;
        isRead: boolean;
        createdAt: Date;
    }>;
    markAllAsRead(userId: string): Promise<{
        success: boolean;
        count: number;
    }>;
    removeForUser(id: string, userId: string): Promise<{
        success: boolean;
        message: string;
    }>;
    findAll(filters: {
        userId?: string;
        skip?: number;
        take?: number;
    }): import(".prisma/client").Prisma.PrismaPromise<{
        id: string;
        userId: string;
        title: string;
        message: string;
        isRead: boolean;
        createdAt: Date;
    }[]>;
    findOne(id: string, user?: any): import(".prisma/client").Prisma.Prisma__NotificationClient<{
        id: string;
        userId: string;
        title: string;
        message: string;
        isRead: boolean;
        createdAt: Date;
    } | null, null, import("@prisma/client/runtime/library").DefaultArgs>;
    update(id: string, updateNotificationDto: UpdateNotificationDto, user?: any): import(".prisma/client").Prisma.Prisma__NotificationClient<{
        id: string;
        userId: string;
        title: string;
        message: string;
        isRead: boolean;
        createdAt: Date;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    remove(id: string, user?: any): import(".prisma/client").Prisma.Prisma__NotificationClient<{
        id: string;
        userId: string;
        title: string;
        message: string;
        isRead: boolean;
        createdAt: Date;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    private getDisplayName;
    notifyApplicationSubmitted(applicationId: string): Promise<void>;
    notifyApplicationStatusChanged(applicationId: string, status: string): Promise<void>;
    notifyInterviewEvent(interviewId: string, eventType: 'SCHEDULED' | 'RESCHEDULED' | 'CANCELLED'): Promise<void>;
    notifyJobModeration(jobId: string, status: 'PUBLISHED' | 'REJECTED' | 'APPROVED' | 'CLOSED'): Promise<void>;
    notifyCourseModeration(courseId: string, status: 'PUBLISHED' | 'REJECTED' | 'APPROVED'): Promise<void>;
    notifyPasswordReset(userId: string): Promise<void>;
    notifyOfferEvent(offerId: string, eventType: 'SENT' | 'ACCEPTED' | 'DECLINED' | 'WITHDRAWN'): Promise<void>;
}

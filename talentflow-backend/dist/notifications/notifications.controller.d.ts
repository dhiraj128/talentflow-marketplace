import { NotificationsService } from './notifications.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
export declare class NotificationsController {
    private readonly notificationsService;
    constructor(notificationsService: NotificationsService);
    create(createNotificationDto: CreateNotificationDto): import(".prisma/client").Prisma.Prisma__NotificationClient<{
        id: string;
        userId: string;
        title: string;
        message: string;
        isRead: boolean;
        createdAt: Date;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    findAll(userId?: string, skip?: string, take?: string): import(".prisma/client").Prisma.PrismaPromise<{
        id: string;
        userId: string;
        title: string;
        message: string;
        isRead: boolean;
        createdAt: Date;
    }[]>;
    findOne(id: string, user: any): import(".prisma/client").Prisma.Prisma__NotificationClient<{
        id: string;
        userId: string;
        title: string;
        message: string;
        isRead: boolean;
        createdAt: Date;
    } | null, null, import("@prisma/client/runtime/library").DefaultArgs>;
    update(id: string, updateNotificationDto: UpdateNotificationDto, user: any): import(".prisma/client").Prisma.Prisma__NotificationClient<{
        id: string;
        userId: string;
        title: string;
        message: string;
        isRead: boolean;
        createdAt: Date;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    remove(id: string, user: any): import(".prisma/client").Prisma.Prisma__NotificationClient<{
        id: string;
        userId: string;
        title: string;
        message: string;
        isRead: boolean;
        createdAt: Date;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
}

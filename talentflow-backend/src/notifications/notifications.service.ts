import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';

@Injectable()
export class NotificationsService {
  constructor(private prisma: PrismaService) {}

  create(createNotificationDto: CreateNotificationDto) {
    return this.prisma.notification.create({ data: createNotificationDto });
  }

  findAll(filters: { userId?: string; skip?: number; take?: number }) {
    const where: any = {};
    if (filters.userId) where.userId = filters.userId;
    return this.prisma.notification.findMany({ 
      where, 
      skip: filters.skip, 
      take: filters.take,
      orderBy: { createdAt: 'desc' }
    });
  }

  findOne(id: string) {
    return this.prisma.notification.findUnique({ where: { id } });
  }

  update(id: string, updateNotificationDto: UpdateNotificationDto) {
    return this.prisma.notification.update({ where: { id }, data: updateNotificationDto });
  }

  remove(id: string) {
    return this.prisma.notification.delete({ where: { id } });
  }
}

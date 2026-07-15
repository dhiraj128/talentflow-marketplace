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

  findAll(skip?: number, take?: number) {
    return this.prisma.notification.findMany({ skip, take });
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

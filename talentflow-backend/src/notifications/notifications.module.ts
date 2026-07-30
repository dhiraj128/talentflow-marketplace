import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { ResendEmailProvider } from '../auth/providers/resend-email.provider';

@Module({
  imports: [PrismaModule],
  controllers: [NotificationsController],
  providers: [NotificationsService, ResendEmailProvider],
  exports: [NotificationsService, ResendEmailProvider],
})
export class NotificationsModule {}

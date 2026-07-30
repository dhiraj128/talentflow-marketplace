import { Module } from '@nestjs/common';
import { TalentCrmService } from './talent-crm.service';
import { TalentCrmController } from './talent-crm.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { ApplicationsModule } from '../applications/applications.module';

@Module({
  imports: [PrismaModule, NotificationsModule, ApplicationsModule],
  controllers: [TalentCrmController],
  providers: [TalentCrmService],
  exports: [TalentCrmService],
})
export class TalentCrmModule {}

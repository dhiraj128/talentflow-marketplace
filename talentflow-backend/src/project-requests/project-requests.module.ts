import { Module } from '@nestjs/common';
import { ProjectRequestsService } from './project-requests.service';
import { ProjectRequestsController } from './project-requests.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [ProjectRequestsService],
  controllers: [ProjectRequestsController]
})
export class ProjectRequestsModule {}

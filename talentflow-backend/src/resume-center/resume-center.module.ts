import { Module } from '@nestjs/common';
import { ResumeCenterService } from './resume-center.service';
import { ResumeCenterController } from './resume-center.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ResumeCenterController],
  providers: [ResumeCenterService],
  exports: [ResumeCenterService],
})
export class ResumeCenterModule {}

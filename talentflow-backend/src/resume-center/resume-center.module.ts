import { Module } from '@nestjs/common';
import { ResumeCenterService } from './resume-center.service';

@Module({
  providers: [ResumeCenterService],
  exports: [ResumeCenterService],
})
export class ResumeCenterModule {}

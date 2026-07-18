import { Controller, Get, Version, VERSION_NEUTRAL } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Version(VERSION_NEUTRAL)
  @Get()
  getRoot() {
    return {
      status: 'ok',
      service: 'TalentFlow Backend',
      version: '1.0.0'
    };
  }

  @Get('health')
  getHealth() {
    return {
      status: 'ok',
      service: 'talentflow-backend',
      aws_region: process.env.AWS_REGION || 'not-set',
      s3_bucket: process.env.AWS_S3_BUCKET || 'not-set'
    };
  }
}

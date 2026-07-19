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
      version: '1.0.0',
    };
  }

  @Get('health')
  getHealth() {
    return {
      status: 'ok',
      service: 'talentflow-backend',
      aws_region: process.env.AWS_REGION || 'not-set',
      s3_bucket: process.env.AWS_S3_BUCKET || 'not-set',
      creds: {
        ACCESS_KEY_ID: !!process.env.ACCESS_KEY_ID,
        AWS_ACCESS_KEY_ID: !!process.env.AWS_ACCESS_KEY_ID,
        SECRET_ACCESS_KEY: !!process.env.SECRET_ACCESS_KEY,
        AWS_SECRET_ACCESS_KEY: !!process.env.AWS_SECRET_ACCESS_KEY,
        accessKeyLast4: process.env.AWS_ACCESS_KEY_ID
          ? process.env.AWS_ACCESS_KEY_ID.slice(-4)
          : process.env.ACCESS_KEY_ID
            ? process.env.ACCESS_KEY_ID.slice(-4)
            : 'none',
        secretHasSpace: process.env.AWS_SECRET_ACCESS_KEY
          ? process.env.AWS_SECRET_ACCESS_KEY.includes(' ')
          : false,
      },
    };
  }
}

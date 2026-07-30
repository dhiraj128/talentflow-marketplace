import { Controller, Get, Version, VERSION_NEUTRAL } from '@nestjs/common';

@Controller()
export class AppController {
  @Version(VERSION_NEUTRAL)
  @Get()
  getRoot() {
    return {
      status: 'ok',
      service: 'TalentFlow Backend',
      version: '1.0.2',
    };
  }
}

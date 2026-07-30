import { Controller, Get, Version, VERSION_NEUTRAL } from '@nestjs/common';
import { HealthService } from './health/health.service';

@Controller()
export class AppController {
  constructor(private readonly healthService: HealthService) {}

  @Version(VERSION_NEUTRAL)
  @Get()
  getRoot() {
    return {
      status: 'ok',
      service: 'TalentFlow Backend',
      version: '1.0.2',
    };
  }

  @Version(VERSION_NEUTRAL)
  @Get('health')
  getHealth() {
    return this.healthService.getHealthStatus();
  }
}

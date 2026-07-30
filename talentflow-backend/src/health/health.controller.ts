import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { HealthService } from './health.service';

@ApiTags('health')
@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get()
  @ApiOperation({ summary: 'Get safe application health & dependency metadata' })
  @ApiResponse({ status: 200, description: 'Health check OK' })
  getHealth() {
    return this.healthService.getHealthStatus();
  }

  @Get('ready')
  @ApiOperation({ summary: 'Get application readiness status (PostgreSQL check)' })
  @ApiResponse({ status: 200, description: 'Application is ready for production traffic' })
  @ApiResponse({ status: 503, description: 'Critical dependency (PostgreSQL) is unavailable' })
  getReadiness() {
    return this.healthService.getReadinessStatus();
  }
}

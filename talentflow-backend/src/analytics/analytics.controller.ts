import { Controller, Get, UseGuards } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('analytics')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('stats')
  @ApiOperation({ summary: 'Get global platform statistics' })
  getPlatformStats() {
    return this.analyticsService.getPlatformStats();
  }

  @Get('dashboard/candidate')
  @ApiOperation({ summary: 'Get candidate dashboard statistics' })
  getCandidateDashboard(@CurrentUser() user: any) {
    return this.analyticsService.getCandidateDashboard(user.sub);
  }

  @Get('dashboard/employer')
  @ApiOperation({ summary: 'Get employer dashboard statistics' })
  getEmployerDashboard(@CurrentUser() user: any) {
    return this.analyticsService.getEmployerDashboard(user.sub);
  }

  @Get('dashboard/freelancer')
  @ApiOperation({ summary: 'Get freelancer dashboard statistics' })
  getFreelancerDashboard(@CurrentUser() user: any) {
    return this.analyticsService.getFreelancerDashboard(user.sub);
  }

  @Get('dashboard/trainer')
  @ApiOperation({ summary: 'Get trainer dashboard statistics' })
  getTrainerDashboard(@CurrentUser() user: any) {
    return this.analyticsService.getTrainerDashboard(user.sub);
  }

  @Get('dashboard/admin')
  @ApiOperation({ summary: 'Get admin dashboard statistics' })
  getAdminDashboard() {
    return this.analyticsService.getAdminDashboard();
  }
}

import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Role } from '@prisma/client';

import { AnalyticsService } from './analytics.service';

import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';

import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';

@ApiTags('analytics')
@ApiBearerAuth()
@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  // ==========================
  // Admin Platform Statistics
  // ==========================

  @Get('stats')
  @ApiOperation({ summary: 'Get global platform statistics (Admin Only)' })
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
  getPlatformStats() {
    return this.analyticsService.getPlatformStats();
  }

  // ==========================
  // Candidate Dashboard
  // ==========================

  @Get('dashboard/candidate')
  @ApiOperation({ summary: 'Get candidate dashboard statistics' })
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.CANDIDATE)
  getCandidateDashboard(@CurrentUser() user: any) {
    return this.analyticsService.getCandidateDashboard(
      user.userId || user.sub,
    );
  }

  // ==========================
  // Employer Dashboard
  // ==========================

  @Get('dashboard/employer')
  @ApiOperation({ summary: 'Get employer dashboard statistics' })
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.EMPLOYER)
  getEmployerDashboard(@CurrentUser() user: any) {
    return this.analyticsService.getEmployerDashboard(
      user.userId || user.sub,
    );
  }

  // ==========================
  // Freelancer Dashboard
  // ==========================

  @Get('dashboard/freelancer')
  @ApiOperation({ summary: 'Get freelancer dashboard statistics' })
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.FREELANCER)
  getFreelancerDashboard(@CurrentUser() user: any) {
    return this.analyticsService.getFreelancerDashboard(
      user.userId || user.sub,
    );
  }

  // ==========================
  // Trainer Dashboard
  // ==========================

  @Get('dashboard/trainer')
  @ApiOperation({ summary: 'Get trainer dashboard statistics' })
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.TRAINER)
  getTrainerDashboard(@CurrentUser() user: any) {
    return this.analyticsService.getTrainerDashboard(
      user.userId || user.sub,
    );
  }

  // ==========================
  // Admin Dashboard
  // ==========================

  @Get('dashboard/admin')
  @ApiOperation({ summary: 'Get admin dashboard statistics (Admin Only)' })
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
  getAdminDashboard() {
    return this.analyticsService.getAdminDashboard();
  }
}
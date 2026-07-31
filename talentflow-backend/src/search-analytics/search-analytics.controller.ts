import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  UseGuards,
} from '@nestjs/common';
import { SearchAnalyticsService } from './search-analytics.service';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Role } from '@prisma/client';

@ApiTags('search-analytics')
@Controller('search-analytics')
export class SearchAnalyticsController {
  constructor(private readonly searchAnalyticsService: SearchAnalyticsService) {}

  @Post('event')
  recordEvent(
    @Body() body: { userId?: string; searchType?: any; query: string; resultCount: number },
  ) {
    return this.searchAnalyticsService.recordSearchEvent(body);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('history')
  getHistory(@CurrentUser() user: any) {
    const userId = user.sub || user.userId;
    return this.searchAnalyticsService.getUserSearchHistory(userId);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete('history')
  clearHistory(@CurrentUser() user: any) {
    const userId = user.sub || user.userId;
    return this.searchAnalyticsService.clearUserSearchHistory(userId);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Get('admin/overview')
  getAdminOverview(@CurrentUser() user: any) {
    return this.searchAnalyticsService.getAdminSearchAnalytics(user);
  }
}

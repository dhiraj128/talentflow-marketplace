import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { JobAlertsService } from './job-alerts.service';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('job-alerts')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('job-alerts')
export class JobAlertsController {
  constructor(private readonly jobAlertsService: JobAlertsService) {}

  @Post()
  create(
    @CurrentUser() user: any,
    @Body() body: { name: string; queryJson: any; frequency?: any; savedSearchId?: string },
  ) {
    const userId = user.sub || user.userId;
    return this.jobAlertsService.create(userId, body);
  }

  @Get()
  findAllForCandidate(@CurrentUser() user: any) {
    const userId = user.sub || user.userId;
    return this.jobAlertsService.findAllForCandidate(userId);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() user: any) {
    const userId = user.sub || user.userId;
    return this.jobAlertsService.remove(id, userId);
  }

  @Post('run-cycle')
  triggerCycle() {
    return this.jobAlertsService.processJobAlerts();
  }
}

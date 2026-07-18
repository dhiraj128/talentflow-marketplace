import { Controller, Post, Param, UseGuards, BadRequestException } from '@nestjs/common';
import { ProgressService } from './progress.service';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@ApiTags('progress')
@Controller('progress')
export class ProgressController {
  constructor(private readonly progressService: ProgressService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('CANDIDATE')
  @Post('lesson/:lessonId')
  markLessonComplete(
    @Param('lessonId') lessonId: string,
    @CurrentUser() user: any
  ) {
    return this.progressService.markLessonComplete(lessonId, user.profile.id);
  }
}

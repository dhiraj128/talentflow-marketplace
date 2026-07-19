import { Controller, Post, Body, Param, UseGuards } from '@nestjs/common';
import { AssessmentsService } from './assessments.service';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from "@prisma/client";

@ApiTags('assessments')
@Controller('assessments')
export class AssessmentsController {
  constructor(private readonly assessmentsService: AssessmentsService) {}

  @ApiBearerAuth()
  @Post(':courseId/submit')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.CANDIDATE, Role.ADMIN)
  submitAssessment(
    @Param('courseId') courseId: string,
    @Body('answers') answers: Record<string, string>,
    @CurrentUser() user: any,
  ) {
    return this.assessmentsService.submitAssessment(
      courseId,
      user.profile.id,
      answers,
    );
  }
}

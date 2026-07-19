import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { InterviewsService } from './interviews.service';
import { CreateInterviewDto } from './dto/create-interview.dto';
import { UpdateInterviewDto } from './dto/update-interview.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from "@prisma/client";
import { CurrentUser } from "../common/decorators/current-user.decorator";

@Controller('interviews')
export class InterviewsController {
  constructor(private readonly interviewsService: InterviewsService) {}

  @Post('schedule')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.EMPLOYER, Role.CANDIDATE, Role.ADMIN)
  schedule(@Body() createInterviewDto: CreateInterviewDto, @Req() req: any) {
    return this.interviewsService.schedule(createInterviewDto, req.user.id);
  }

  @Get('employer')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.EMPLOYER, Role.CANDIDATE, Role.ADMIN)
  findAllByEmployer(@Req() req: any) {
    return this.interviewsService.findAllByEmployer(req.user.id);
  }

  @Get('candidate')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.EMPLOYER, Role.CANDIDATE, Role.ADMIN)
  findAllByCandidate(@Req() req: any) {
    return this.interviewsService.findAllByCandidate(req.user.id);
  }

  @Get(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.EMPLOYER, Role.CANDIDATE, Role.ADMIN)
  findOne(@Param('id') id: string, @Req() req: any, @CurrentUser() user: any) {
    return this.interviewsService.findOne(id, req.user.id, req.user.role);
  }

  @Patch(':id/reschedule')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.EMPLOYER, Role.CANDIDATE, Role.ADMIN)
  reschedule(
    @Param('id') id: string,
    @Body() updateInterviewDto: UpdateInterviewDto,
    @Req() req: any,
  ) {
    return this.interviewsService.reschedule(
      id,
      updateInterviewDto,
      req.user.id,
    );
  }

  @Patch(':id/cancel')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.EMPLOYER, Role.CANDIDATE, Role.ADMIN)
  cancel(@Param('id') id: string, @Req() req: any) {
    return this.interviewsService.cancel(id, req.user.id, req.user.role);
  }

  @Patch(':id/complete')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.EMPLOYER, Role.CANDIDATE, Role.ADMIN)
  complete(
    @Param('id') id: string,
    @Body() body: { feedback?: string },
    @Req() req: any,
  ) {
    return this.interviewsService.complete(id, body.feedback, req.user.id);
  }

  @Patch(':id/no-show')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.EMPLOYER, Role.CANDIDATE, Role.ADMIN)
  markNoShow(@Param('id') id: string, @Req() req: any) {
    return this.interviewsService.markNoShow(id, req.user.id);
  }

  @Delete(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.EMPLOYER, Role.CANDIDATE, Role.ADMIN)
  remove(@Param('id') id: string, @Req() req: any, @CurrentUser() user: any) {
    return this.interviewsService.remove(id, req.user.id, req.user.role);
  }
}

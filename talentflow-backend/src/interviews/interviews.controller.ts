import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { InterviewsService } from './interviews.service';
import { CreateInterviewDto } from './dto/create-interview.dto';
import { UpdateInterviewDto } from './dto/update-interview.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@Controller('interviews')
@UseGuards(JwtAuthGuard, RolesGuard)
export class InterviewsController {
  constructor(private readonly interviewsService: InterviewsService) {}

  @Post('schedule')
  @Roles('EMPLOYER')
  schedule(@Body() createInterviewDto: CreateInterviewDto, @Req() req: any) {
    return this.interviewsService.schedule(createInterviewDto, req.user.id);
  }

  @Get('employer')
  @Roles('EMPLOYER')
  findAllByEmployer(@Req() req: any) {
    return this.interviewsService.findAllByEmployer(req.user.id);
  }

  @Get('candidate')
  @Roles('CANDIDATE')
  findAllByCandidate(@Req() req: any) {
    return this.interviewsService.findAllByCandidate(req.user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.interviewsService.findOne(id);
  }

  @Patch(':id/reschedule')
  @Roles('EMPLOYER')
  reschedule(@Param('id') id: string, @Body() updateInterviewDto: UpdateInterviewDto) {
    return this.interviewsService.reschedule(id, updateInterviewDto);
  }

  @Patch(':id/cancel')
  @Roles('EMPLOYER', 'CANDIDATE')
  cancel(@Param('id') id: string) {
    return this.interviewsService.cancel(id);
  }

  @Patch(':id/complete')
  @Roles('EMPLOYER')
  complete(@Param('id') id: string, @Body() body: { feedback?: string }) {
    return this.interviewsService.complete(id, body.feedback);
  }

  @Delete(':id')
  @Roles('EMPLOYER', 'ADMIN')
  remove(@Param('id') id: string) {
    return this.interviewsService.remove(id);
  }
}

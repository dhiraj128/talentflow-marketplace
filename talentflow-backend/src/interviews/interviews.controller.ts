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
  findOne(@Param('id') id: string, @Req() req: any) {
    return this.interviewsService.findOne(id, req.user.id, req.user.role);
  }

  @Patch(':id/reschedule')
  @Roles('EMPLOYER')
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
  @Roles('EMPLOYER', 'CANDIDATE')
  cancel(@Param('id') id: string, @Req() req: any) {
    return this.interviewsService.cancel(id, req.user.id, req.user.role);
  }

  @Patch(':id/complete')
  @Roles('EMPLOYER')
  complete(
    @Param('id') id: string,
    @Body() body: { feedback?: string },
    @Req() req: any,
  ) {
    return this.interviewsService.complete(id, body.feedback, req.user.id);
  }

  @Patch(':id/no-show')
  @Roles('EMPLOYER')
  markNoShow(@Param('id') id: string, @Req() req: any) {
    return this.interviewsService.markNoShow(id, req.user.id);
  }

  @Delete(':id')
  @Roles('EMPLOYER', 'ADMIN')
  remove(@Param('id') id: string, @Req() req: any) {
    return this.interviewsService.remove(id, req.user.id, req.user.role);
  }
}

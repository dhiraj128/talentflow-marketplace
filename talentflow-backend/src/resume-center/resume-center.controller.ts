import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { ResumeCenterService } from './resume-center.service';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@ApiTags('resume-center')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('resumes')
export class ResumeCenterController {
  constructor(private readonly resumeService: ResumeCenterService) {}

  @Post()
  create(@Body() data: any) {
    return this.resumeService.create(data);
  }

  @Get()
  findAll(@Query('candidateId') candidateId?: string) {
    return this.resumeService.findAll(candidateId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.resumeService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() data: any) {
    return this.resumeService.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.resumeService.remove(id);
  }
}

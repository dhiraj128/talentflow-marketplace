import { CreateResumeCenterDto } from './dto/create.dto';
import { UpdateResumeCenterDto } from './dto/update.dto';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
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
  create(@Body() createDto: CreateResumeCenterDto) {
    return this.resumeService.create(createDto);
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
  update(@Param('id') id: string, @Body() updateDto: UpdateResumeCenterDto) {
    return this.resumeService.update(id, updateDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.resumeService.remove(id);
  }
}

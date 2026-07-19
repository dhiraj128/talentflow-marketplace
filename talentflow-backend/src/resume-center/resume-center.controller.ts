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
import { Role } from "@prisma/client";
import { Roles } from "../common/decorators/roles.decorator";
import { RolesGuard } from "../common/guards/roles.guard";

@ApiTags('resume-center')
@ApiBearerAuth()
@Controller('resumes')
export class ResumeCenterController {
  constructor(private readonly resumeService: ResumeCenterService) {}

  @Post()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.CANDIDATE, Role.ADMIN)
  create(@Body() createDto: CreateResumeCenterDto) {
    return this.resumeService.create(createDto);
  }

  @Get()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.CANDIDATE, Role.ADMIN)
  findAll(@Query('candidateId') candidateId?: string) {
    return this.resumeService.findAll(candidateId);
  }

  @Get(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.CANDIDATE, Role.ADMIN)
  findOne(@Param('id') id: string) {
    return this.resumeService.findOne(id);
  }

  @Patch(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.CANDIDATE, Role.ADMIN)
  update(@Param('id') id: string, @Body() updateDto: UpdateResumeCenterDto) {
    return this.resumeService.update(id, updateDto);
  }

  @Delete(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.CANDIDATE, Role.ADMIN)
  remove(@Param('id') id: string) {
    return this.resumeService.remove(id);
  }
}

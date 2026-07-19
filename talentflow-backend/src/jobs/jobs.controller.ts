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
import { JobsService } from './jobs.service';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { HttpException, HttpStatus } from '@nestjs/common';
import { Role } from "@prisma/client";
import { Roles } from "../common/decorators/roles.decorator";
import { RolesGuard } from "../common/guards/roles.guard";

@ApiTags('jobs')
@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @ApiBearerAuth()
  @Post()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.EMPLOYER, Role.ADMIN)
  create(@Body() createJobDto: CreateJobDto, @CurrentUser() user: any) {
    return this.jobsService.create(createJobDto, user.sub || user.userId);
  }

  @Get()
  findAll(
    @Query('q') q?: string,
    @Query('location') location?: string,
    @Query('type') type?: string,
    @Query('employerId') employerId?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.jobsService.findAll({
      q,
      location,
      type,
      employerId,
      page,
      limit,
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.jobsService.findOne(id);
  }

  @ApiBearerAuth()
  @Get('employer/me')
  getEmployerJobs(@CurrentUser() user: any) {
    return this.jobsService.findEmployerJobs(user.sub || user.userId);
  }

  @ApiBearerAuth()
  @Patch(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.EMPLOYER, Role.ADMIN)
  update(
    @Param('id') id: string,
    @Body() updateJobDto: UpdateJobDto,
    @CurrentUser() user: any,
  ) {
    return this.jobsService.update(id, updateJobDto, user);
  }

  @ApiBearerAuth()
  @Delete(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.EMPLOYER, Role.ADMIN)
  remove(@Param('id') id: string, @CurrentUser() user: any) {
    return this.jobsService.remove(id, user);
  }

  @ApiBearerAuth()
  @Patch(':id/approve')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.EMPLOYER, Role.ADMIN)
  approveJob(@Param('id') id: string, @CurrentUser() user: any) {
    return this.jobsService.approveJob(id, user);
  }

  @ApiBearerAuth()
  @Post(':id/apply')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.EMPLOYER, Role.ADMIN)
  async applyToJob(
    @Param('id') id: string,
    @Body() body: { resumeId?: string },
    @CurrentUser() user: any,
  ) {
    try {
      return await this.jobsService.applyToJob(
        id,
        user.sub || user.userId,
        body?.resumeId,
      );
    } catch (error: any) {
      if (error.message.includes('not found')) {
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
      }
      if (error.message.includes('Only registered candidates')) {
        throw new HttpException(error.message, HttpStatus.FORBIDDEN);
      }
      if (error.message.includes('Already applied')) {
        throw new HttpException(error.message, HttpStatus.CONFLICT);
      }
      if (error.message.includes('not open for applications')) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }
      throw new HttpException(
        'Failed to apply to job',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @ApiBearerAuth()
  @Get(':id/application-status')
  async checkApplicationStatus(
    @Param('id') id: string,
    @CurrentUser() user: any,
  ) {
    return this.jobsService.checkApplicationStatus(id, user.sub || user.userId);
  }
}

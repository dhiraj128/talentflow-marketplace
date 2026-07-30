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
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { JobsService } from './jobs.service';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Role } from '@prisma/client';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';

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

  // STATIC ROUTES DECLARED BEFORE DYNAMIC PARAMETER :id
  @ApiBearerAuth()
  @Get('saved/my-saved-jobs')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.CANDIDATE, Role.ADMIN)
  getSavedJobs(@CurrentUser() user: any) {
    return this.jobsService.getSavedJobs(user.sub || user.userId);
  }

  @ApiBearerAuth()
  @Get('recommended')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.CANDIDATE, Role.ADMIN)
  getRecommendedJobs(@CurrentUser() user: any) {
    return this.jobsService.getRecommendedJobs(user.sub || user.userId);
  }

  @ApiBearerAuth()
  @Get('admin/pending')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  findPendingAdmin(@Query('page') page?: string, @Query('limit') limit?: string) {
    return this.jobsService.findAdminPending({ page, limit });
  }

  @ApiBearerAuth()
  @Get('employer/me')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.EMPLOYER, Role.ADMIN)
  getEmployerJobs(@CurrentUser() user: any) {
    return this.jobsService.findEmployerJobs(user.sub || user.userId);
  }

  // DYNAMIC PARAMETER ROUTES AFTER ALL STATIC ROUTES
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.jobsService.findOne(id);
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
  @Roles(Role.ADMIN)
  approveJob(@Param('id') id: string, @CurrentUser() user: any) {
    return this.jobsService.approveJob(id, user);
  }

  @ApiBearerAuth()
  @Patch(':id/reject')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  rejectJob(@Param('id') id: string, @CurrentUser() user: any) {
    return this.jobsService.rejectJob(id, user);
  }

  @ApiBearerAuth()
  @Post(':id/apply')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.CANDIDATE, Role.ADMIN)
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

  @ApiBearerAuth()
  @Post(':id/save')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.CANDIDATE, Role.ADMIN)
  saveJob(@Param('id') id: string, @CurrentUser() user: any) {
    return this.jobsService.saveJob(id, user.sub || user.userId);
  }

  @ApiBearerAuth()
  @Delete(':id/save')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.CANDIDATE, Role.ADMIN)
  unsaveJob(@Param('id') id: string, @CurrentUser() user: any) {
    return this.jobsService.unsaveJob(id, user.sub || user.userId);
  }
}

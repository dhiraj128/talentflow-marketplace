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
import { ApplicationsService } from './applications.service';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationDto } from './dto/update-application.dto';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Role } from "@prisma/client";
import { Roles } from "../common/decorators/roles.decorator";
import { RolesGuard } from "../common/guards/roles.guard";

@ApiTags('applications')
@Controller('applications')
export class ApplicationsController {
  constructor(private readonly applicationsService: ApplicationsService) {}

  @ApiBearerAuth()
  @Post()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.CANDIDATE, Role.ADMIN)
  create(@Body() createApplicationDto: CreateApplicationDto) {
    return this.applicationsService.create(createApplicationDto);
  }

  @Get()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.CANDIDATE, Role.EMPLOYER, Role.ADMIN)
  findAll(
    @Query('candidateId') candidateId?: string,
    @Query('employerId') employerId?: string,
    @Query('jobId') jobId?: string,
  ) {
    return this.applicationsService.findAll({ candidateId, employerId, jobId });
  }

  @ApiBearerAuth()
  @Get('employer/me')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.CANDIDATE, Role.EMPLOYER, Role.ADMIN)
  getEmployerApplications(@CurrentUser() user: any) {
    return this.applicationsService.findEmployerApplications(
      user.sub || user.userId,
    );
  }

  @Get(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.CANDIDATE, Role.EMPLOYER, Role.ADMIN)
  findOne(@Param('id') id: string) {
    return this.applicationsService.findOne(id);
  }

  @ApiBearerAuth()
  @Patch(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.CANDIDATE, Role.ADMIN)
  update(
    @Param('id') id: string,
    @Body() updateApplicationDto: UpdateApplicationDto,
  ) {
    return this.applicationsService.update(id, updateApplicationDto);
  }

  @ApiBearerAuth()
  @Delete(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.CANDIDATE, Role.ADMIN)
  remove(@Param('id') id: string) {
    return this.applicationsService.remove(id);
  }

  @ApiBearerAuth()
  @Patch(':id/status')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.EMPLOYER, Role.ADMIN)
  updateStatus(
    @Param('id') id: string,
    @Body('status') status: string,
    @CurrentUser() user: any,
  ) {
    return this.applicationsService.updateStatus(id, status, user);
  }
}

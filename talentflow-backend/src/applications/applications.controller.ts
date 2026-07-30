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
import { Role } from '@prisma/client';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';

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
    @Query('status') status?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.applicationsService.findAll({
      candidateId,
      employerId,
      jobId,
      status,
      page,
      limit,
    });
  }

  @ApiBearerAuth()
  @Get('employer/me')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.EMPLOYER, Role.ADMIN)
  getEmployerApplications(@CurrentUser() user: any) {
    return this.applicationsService.findEmployerApplications(
      user.sub || user.userId,
    );
  }

  @ApiBearerAuth()
  @Get('pipeline')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.EMPLOYER, Role.ADMIN)
  getEmployerPipeline(@CurrentUser() user: any, @Query() query: any) {
    return this.applicationsService.getEmployerPipeline(user, query);
  }

  @ApiBearerAuth()
  @Get('analytics')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.EMPLOYER, Role.ADMIN)
  getEmployerAnalytics(@CurrentUser() user: any) {
    return this.applicationsService.getEmployerAnalytics(user);
  }

  @ApiBearerAuth()
  @Get('tags')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.EMPLOYER, Role.ADMIN)
  getTags(@CurrentUser() user: any) {
    return this.applicationsService.getTags(user);
  }

  @ApiBearerAuth()
  @Post('tags')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.EMPLOYER, Role.ADMIN)
  createTag(@Body('name') name: string, @Body('color') color: string, @CurrentUser() user: any) {
    return this.applicationsService.createTag(name, color, user);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.CANDIDATE, Role.EMPLOYER, Role.ADMIN)
  findOne(@Param('id') id: string, @CurrentUser() user: any) {
    return this.applicationsService.findOne(id, user);
  }

  @ApiBearerAuth()
  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.CANDIDATE, Role.EMPLOYER, Role.ADMIN)
  update(
    @Param('id') id: string,
    @Body() updateApplicationDto: UpdateApplicationDto,
    @CurrentUser() user: any,
  ) {
    return this.applicationsService.update(id, updateApplicationDto, user);
  }

  @ApiBearerAuth()
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.CANDIDATE, Role.ADMIN)
  remove(@Param('id') id: string, @CurrentUser() user: any) {
    return this.applicationsService.remove(id, user);
  }

  @ApiBearerAuth()
  @Patch(':id/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.EMPLOYER, Role.ADMIN)
  updateStatus(
    @Param('id') id: string,
    @Body('status') status: string,
    @Body('reason') reason: string,
    @CurrentUser() user: any,
  ) {
    return this.applicationsService.updateStatus(id, status, user, reason);
  }

  @ApiBearerAuth()
  @Patch(':id/withdraw')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.CANDIDATE, Role.ADMIN)
  withdraw(
    @Param('id') id: string,
    @Body('reason') reason: string,
    @CurrentUser() user: any,
  ) {
    return this.applicationsService.withdraw(id, user, reason);
  }

  @ApiBearerAuth()
  @Get(':id/history')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.CANDIDATE, Role.EMPLOYER, Role.ADMIN)
  getStatusHistory(@Param('id') id: string, @CurrentUser() user: any) {
    return this.applicationsService.getStatusHistory(id, user);
  }

  @ApiBearerAuth()
  @Post(':id/notes')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.EMPLOYER, Role.ADMIN)
  createNote(
    @Param('id') id: string,
    @Body('content') content: string,
    @CurrentUser() user: any,
  ) {
    return this.applicationsService.createNote(id, content, user);
  }

  @ApiBearerAuth()
  @Get(':id/notes')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.EMPLOYER, Role.ADMIN)
  getNotes(@Param('id') id: string, @CurrentUser() user: any) {
    return this.applicationsService.getNotes(id, user);
  }

  @ApiBearerAuth()
  @Delete('notes/:noteId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.EMPLOYER, Role.ADMIN)
  deleteNote(@Param('noteId') noteId: string, @CurrentUser() user: any) {
    return this.applicationsService.deleteNote(noteId, user);
  }

  @ApiBearerAuth()
  @Post(':id/tags/:tagId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.EMPLOYER, Role.ADMIN)
  assignTag(
    @Param('id') id: string,
    @Param('tagId') tagId: string,
    @CurrentUser() user: any,
  ) {
    return this.applicationsService.assignTag(id, tagId, user);
  }

  @ApiBearerAuth()
  @Delete(':id/tags/:tagId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.EMPLOYER, Role.ADMIN)
  removeTag(
    @Param('id') id: string,
    @Param('tagId') tagId: string,
    @CurrentUser() user: any,
  ) {
    return this.applicationsService.removeTag(id, tagId, user);
  }
}

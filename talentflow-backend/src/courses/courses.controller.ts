import {
  CreateModuleDto,
  CreateLessonDto,
  CreateAssessmentDto,
  CreateQuestionDto,
} from './dto/course-parts.dto';
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
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { Role } from "@prisma/client";

@ApiTags('courses')
@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @ApiBearerAuth()
  @Post()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.TRAINER, Role.ADMIN)
  create(@Body() createCourseDto: CreateCourseDto, @CurrentUser() user: any) {
    const trainerId = user.profile.id;
    return this.coursesService.create(createCourseDto, trainerId);
  }

  @ApiBearerAuth()
  @Get('my-learning')
  getMyLearning(@CurrentUser() user: any) {
    return this.coursesService.getMyLearning(user.profile.id);
  }

  @Get()
  findAll(
    @Query('q') q?: string,
    @Query('category') category?: string,
    @Query('trainerId') trainerId?: string,
  ) {
    return this.coursesService.findAll({ q, category, trainerId });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.coursesService.findOne(id);
  }

  @ApiBearerAuth()
  @Post(':id/enroll')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.TRAINER, Role.ADMIN)
  enroll(@Param('id') id: string, @CurrentUser() user: any) {
    return this.coursesService.enroll(id, user.profile.id);
  }

  @ApiBearerAuth()
  @Patch(':id/approve')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.TRAINER, Role.ADMIN)
  approve(@Param('id') id: string) {
    return this.coursesService.approve(id);
  }

  @ApiBearerAuth()
  @Patch(':id/submit')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.TRAINER, Role.ADMIN)
  submit(@Param('id') id: string, @CurrentUser() user: any) {
    return this.coursesService.submit(id, user.profile.id);
  }

  @ApiBearerAuth()
  @Post(':id/modules')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.TRAINER, Role.ADMIN)
  createModule(
    @Param('id') courseId: string,
    @Body() data: CreateModuleDto,
    @CurrentUser() user: any,
  ) {
    return this.coursesService.createModule(courseId, data, user.profile.id);
  }

  @ApiBearerAuth()
  @Post('modules/:moduleId/lessons')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.TRAINER, Role.ADMIN)
  createLesson(
    @Param('moduleId') moduleId: string,
    @Body() data: CreateLessonDto,
    @CurrentUser() user: any,
  ) {
    return this.coursesService.createLesson(moduleId, data, user.profile.id);
  }

  @ApiBearerAuth()
  @Post(':courseId/assessment')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.TRAINER, Role.ADMIN)
  createAssessment(
    @Param('courseId') courseId: string,
    @Body() data: CreateAssessmentDto,
    @CurrentUser() user: any,
  ) {
    return this.coursesService.createAssessment(
      courseId,
      data,
      user.profile.id,
    );
  }

  @ApiBearerAuth()
  @Post('assessments/:assessmentId/questions')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.TRAINER, Role.ADMIN)
  createQuestion(
    @Param('assessmentId') assessmentId: string,
    @Body() data: CreateQuestionDto,
    @CurrentUser() user: any,
  ) {
    return this.coursesService.createQuestion(
      assessmentId,
      data,
      user.profile.id,
    );
  }

  @ApiBearerAuth()
  @Patch(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.TRAINER, Role.ADMIN)
  update(
    @Param('id') id: string,
    @Body() updateCourseDto: UpdateCourseDto,
    @CurrentUser() user: any,
  ) {
    return this.coursesService.update(id, updateCourseDto, user.profile.id);
  }

  @ApiBearerAuth()
  @Delete(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.TRAINER, Role.ADMIN)
  remove(@Param('id') id: string, @CurrentUser() user: any) {
    return this.coursesService.remove(id, user.profile.id);
  }
}

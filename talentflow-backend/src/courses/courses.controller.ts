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

@ApiTags('courses')
@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('TRAINER')
  @Post()
  create(@Body() createCourseDto: CreateCourseDto, @CurrentUser() user: any) {
    const trainerId = user.profile.id;
    return this.coursesService.create(createCourseDto, trainerId);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('CANDIDATE')
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
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('CANDIDATE')
  @Post(':id/enroll')
  enroll(@Param('id') id: string, @CurrentUser() user: any) {
    return this.coursesService.enroll(id, user.profile.id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'TRAINER')
  @Patch(':id/approve')
  approve(@Param('id') id: string) {
    return this.coursesService.approve(id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('TRAINER')
  @Patch(':id/submit')
  submit(@Param('id') id: string, @CurrentUser() user: any) {
    return this.coursesService.submit(id, user.profile.id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('TRAINER')
  @Post(':id/modules')
  createModule(
    @Param('id') courseId: string,
    @Body() data: CreateModuleDto,
    @CurrentUser() user: any,
  ) {
    return this.coursesService.createModule(courseId, data, user.profile.id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('TRAINER')
  @Post('modules/:moduleId/lessons')
  createLesson(
    @Param('moduleId') moduleId: string,
    @Body() data: CreateLessonDto,
    @CurrentUser() user: any,
  ) {
    return this.coursesService.createLesson(moduleId, data, user.profile.id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('TRAINER')
  @Post(':courseId/assessment')
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
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('TRAINER')
  @Post('assessments/:assessmentId/questions')
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
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('TRAINER')
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCourseDto: UpdateCourseDto,
    @CurrentUser() user: any,
  ) {
    return this.coursesService.update(id, updateCourseDto, user.profile.id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('TRAINER')
  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() user: any) {
    return this.coursesService.remove(id, user.profile.id);
  }
}

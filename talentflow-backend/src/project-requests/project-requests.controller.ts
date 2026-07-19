import { CreateReviewDto } from './dto/create-review.dto';
import { CreateProjectRequestDto } from './dto/create-request.dto';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ProjectRequestsService } from './project-requests.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@Controller('project-requests')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProjectRequestsController {
  constructor(
    private readonly projectRequestsService: ProjectRequestsService,
  ) {}

  @Post()
  @Roles('EMPLOYER')
  createRequest(@Req() req: any, @Body() createData: CreateProjectRequestDto) {
    return this.projectRequestsService.createRequest(req.user.id, createData);
  }

  @Get('freelancer')
  @Roles('FREELANCER')
  getFreelancerRequests(@Req() req: any) {
    return this.projectRequestsService.getFreelancerRequests(req.user.id);
  }

  @Get('employer')
  @Roles('EMPLOYER')
  getEmployerRequests(@Req() req: any) {
    return this.projectRequestsService.getEmployerRequests(req.user.id);
  }

  @Patch(':id/status')
  updateStatus(
    @Req() req: any,
    @Param('id') id: string,
    @Body('status') status: 'ACCEPTED' | 'REJECTED' | 'COMPLETED',
  ) {
    return this.projectRequestsService.updateStatus(
      req.user.id,
      req.user.role,
      id,
      status,
    );
  }

  @Post(':id/review')
  @Roles('EMPLOYER')
  createReview(
    @Req() req: any,
    @Param('id') id: string,
    @Body() reviewData: CreateReviewDto,
  ) {
    return this.projectRequestsService.createReview(
      req.user.id,
      id,
      reviewData,
    );
  }
}

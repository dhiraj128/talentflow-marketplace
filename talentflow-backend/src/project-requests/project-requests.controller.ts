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
import { Role } from "@prisma/client";
import { CurrentUser } from "../common/decorators/current-user.decorator";

@Controller('project-requests')
export class ProjectRequestsController {
  constructor(
    private readonly projectRequestsService: ProjectRequestsService,
  ) {}

  @Post()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.EMPLOYER, Role.FREELANCER, Role.ADMIN)
  createRequest(@Req() req: any, @Body() createData: CreateProjectRequestDto) {
    return this.projectRequestsService.createRequest(req.user.id, createData);
  }

  @Get('freelancer')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.EMPLOYER, Role.FREELANCER, Role.ADMIN)
  getFreelancerRequests(@Req() req: any) {
    return this.projectRequestsService.getFreelancerRequests(req.user.id);
  }

  @Get('employer')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.EMPLOYER, Role.FREELANCER, Role.ADMIN)
  getEmployerRequests(@Req() req: any) {
    return this.projectRequestsService.getEmployerRequests(req.user.id);
  }

  @Patch(':id/status')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.EMPLOYER, Role.FREELANCER, Role.ADMIN)
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
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.EMPLOYER, Role.FREELANCER, Role.ADMIN)
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

import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { ReportReviewDto } from './dto/report-review.dto';
import { ModerateReviewDto, ResolveReportDto } from './dto/moderate-review.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role, ReviewStatus, ReviewReportStatus } from '@prisma/client';

@Controller()
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  /**
   * Create a new verified review.
   */
  @UseGuards(JwtAuthGuard)
  @Post('reviews')
  async createReview(@Request() req: any, @Body() dto: CreateReviewDto) {
    return this.reviewsService.createReview(req.user.userId, dto);
  }

  /**
   * Get reviews given by logged-in user.
   */
  @UseGuards(JwtAuthGuard)
  @Get('reviews/me/given')
  async getMyGivenReviews(@Request() req: any) {
    return this.reviewsService.getReviewsGivenBy(req.user.userId);
  }

  /**
   * Get reviews received by logged-in user.
   */
  @UseGuards(JwtAuthGuard)
  @Get('reviews/me/received')
  async getMyReceivedReviews(@Request() req: any) {
    return this.reviewsService.getReviewsReceivedBy(req.user.userId);
  }

  /**
   * Get reviews for a specific user (Candidate, Employer, or Trainer).
   */
  @Get('reviews/user/:userId')
  async getReviewsForUser(@Param('userId') userId: string) {
    return this.reviewsService.getReviewsForUser(userId);
  }

  /**
   * Get reviews for a specific course.
   */
  @Get('reviews/course/:courseId')
  async getReviewsForCourse(@Param('courseId') courseId: string) {
    return this.reviewsService.getReviewsForCourse(courseId);
  }

  /**
   * Get single review by ID.
   */
  @Get('reviews/:id')
  async getReviewById(@Param('id') id: string) {
    return this.reviewsService.getReviewById(id);
  }

  /**
   * Edit own review.
   */
  @UseGuards(JwtAuthGuard)
  @Patch('reviews/:id')
  async updateReview(
    @Param('id') id: string,
    @Request() req: any,
    @Body() dto: UpdateReviewDto,
  ) {
    return this.reviewsService.updateReview(id, req.user.userId, dto);
  }

  /**
   * Delete review (author or admin).
   */
  @UseGuards(JwtAuthGuard)
  @Delete('reviews/:id')
  async deleteReview(@Param('id') id: string, @Request() req: any) {
    const isAdmin = req.user.role === Role.ADMIN;
    return this.reviewsService.deleteReview(id, req.user.userId, isAdmin);
  }

  /**
   * Report a review.
   */
  @UseGuards(JwtAuthGuard)
  @Post('reviews/:id/report')
  async reportReview(
    @Param('id') id: string,
    @Request() req: any,
    @Body() dto: ReportReviewDto,
  ) {
    return this.reviewsService.reportReview(id, req.user.userId, dto);
  }

  /**
   * Admin: List all reviews.
   */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Get('admin/reviews')
  async getAdminReviews(@Query('status') status?: ReviewStatus) {
    return this.reviewsService.getAdminReviews(status);
  }

  /**
   * Admin: List all reported reviews.
   */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Get('admin/reviews/reports')
  async getAdminReports(@Query('status') status?: ReviewReportStatus) {
    return this.reviewsService.getAdminReports(status);
  }

  /**
   * Admin: Moderate a review.
   */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Patch('admin/reviews/:id/moderate')
  async moderateReview(
    @Param('id') id: string,
    @Request() req: any,
    @Body() dto: ModerateReviewDto,
  ) {
    return this.reviewsService.moderateReview(id, req.user.userId, dto);
  }

  /**
   * Admin: Resolve a review report.
   */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Patch('admin/review-reports/:id/resolve')
  async resolveReport(
    @Param('id') id: string,
    @Request() req: any,
    @Body() dto: ResolveReportDto,
  ) {
    return this.reviewsService.resolveReport(id, req.user.userId, dto);
  }
}

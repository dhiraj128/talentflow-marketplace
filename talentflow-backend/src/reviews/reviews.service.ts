import {
  Injectable,
  ForbiddenException,
  NotFoundException,
  BadRequestException,
  ConflictException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { AuditLogsService } from '../audit-logs/audit-logs.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { ReportReviewDto } from './dto/report-review.dto';
import { ModerateReviewDto, ResolveReportDto } from './dto/moderate-review.dto';
import { ReviewRelationshipType, ReviewStatus, ReviewReportStatus } from '@prisma/client';

@Injectable()
export class ReviewsService {
  private readonly logger = new Logger(ReviewsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationsService: NotificationsService,
    private readonly auditLogsService: AuditLogsService,
  ) {}

  /**
   * Server-side eligibility validation for reviews based on REAL database relationships.
   */
  async validateEligibility(reviewerUserId: string, dto: CreateReviewDto) {
    const { relationshipType, relationshipId, subjectUserId, courseId } = dto;

    if (relationshipType === ReviewRelationshipType.EMPLOYER_TO_CANDIDATE) {
      // Find application matching relationshipId or job relationship
      const application = await this.prisma.application.findFirst({
        where: {
          id: relationshipId,
          job: { employer: { userId: reviewerUserId } },
        },
        include: {
          candidate: true,
          job: { include: { employer: true } },
          statusHistory: true,
        },
      });

      if (!application) {
        throw new ForbiddenException(
          'Ineligible: You do not own a valid hiring relationship for this candidate application.',
        );
      }

      const isHired =
        application.status === 'HIRED' ||
        application.status === 'OFFERED' ||
        application.statusHistory.some((h) => h.toStatus === 'HIRED');

      if (!isHired) {
        throw new ForbiddenException(
          'Ineligible: Candidates can only be reviewed after reaching an eligible stage (e.g. Hired/Offered).',
        );
      }

      const targetSubjectUserId = application.candidate.userId;
      return { subjectUserId: targetSubjectUserId, courseId: null };
    }

    if (relationshipType === ReviewRelationshipType.CANDIDATE_TO_EMPLOYER) {
      const application = await this.prisma.application.findFirst({
        where: {
          id: relationshipId,
          candidate: { userId: reviewerUserId },
        },
        include: {
          candidate: true,
          job: { include: { employer: true } },
          statusHistory: true,
        },
      });

      if (!application) {
        throw new ForbiddenException(
          'Ineligible: You do not own a valid application relationship with this employer.',
        );
      }

      const isHired =
        application.status === 'HIRED' ||
        application.status === 'OFFERED' ||
        application.statusHistory.some((h) => h.toStatus === 'HIRED');

      if (!isHired) {
        throw new ForbiddenException(
          'Ineligible: Employers can only be reviewed after an eligible hiring stage.',
        );
      }

      const targetSubjectUserId = application.job.employer.userId;
      return { subjectUserId: targetSubjectUserId, courseId: null };
    }

    if (relationshipType === ReviewRelationshipType.STUDENT_TO_COURSE) {
      const targetCourseId = courseId || relationshipId;
      const enrollment = await this.prisma.enrollment.findFirst({
        where: {
          candidate: { userId: reviewerUserId },
          courseId: targetCourseId,
        },
        include: { course: true },
      });

      if (!enrollment) {
        throw new ForbiddenException(
          'Ineligible: You must be enrolled in this course to leave a review.',
        );
      }

      return { subjectUserId: null, courseId: targetCourseId };
    }

    if (relationshipType === ReviewRelationshipType.STUDENT_TO_TRAINER) {
      if (!subjectUserId) {
        throw new BadRequestException('subjectUserId is required for trainer reviews.');
      }

      const enrollment = await this.prisma.enrollment.findFirst({
        where: {
          candidate: { userId: reviewerUserId },
          course: { trainer: { userId: subjectUserId } },
        },
      });

      if (!enrollment) {
        throw new ForbiddenException(
          'Ineligible: You must be enrolled in a course by this trainer to leave a review.',
        );
      }

      return { subjectUserId, courseId: null };
    }

    if (relationshipType === ReviewRelationshipType.CLIENT_TO_FREELANCER) {
      if (!subjectUserId) {
        throw new BadRequestException('subjectUserId is required for freelancer reviews.');
      }

      const projectRequest = await this.prisma.projectRequest.findFirst({
        where: {
          id: relationshipId,
          employer: { userId: reviewerUserId },
          freelancer: { userId: subjectUserId },
          status: 'COMPLETED',
        },
      });

      if (!projectRequest) {
        throw new ForbiddenException(
          'Ineligible: A completed contract relationship is required to review this freelancer.',
        );
      }

      return { subjectUserId, courseId: null };
    }

    throw new BadRequestException(`Unsupported relationship type: ${relationshipType}`);
  }

  /**
   * Create a new verified review.
   */
  async createReview(reviewerUserId: string, dto: CreateReviewDto) {
    if (!dto.comment || !dto.comment.trim()) {
      throw new BadRequestException('Review comment cannot be empty or whitespace-only.');
    }

    if (dto.rating < 1 || dto.rating > 5) {
      throw new BadRequestException('Rating must be between 1 and 5.');
    }

    // Check duplicate review constraint
    const existing = await this.prisma.review.findUnique({
      where: {
        reviewerUserId_relationshipType_relationshipId: {
          reviewerUserId,
          relationshipType: dto.relationshipType,
          relationshipId: dto.relationshipId,
        },
      },
    });

    if (existing) {
      throw new ConflictException('You have already submitted a review for this relationship.');
    }

    // Server-side eligibility check
    const { subjectUserId, courseId } = await this.validateEligibility(reviewerUserId, dto);

    const review = await this.prisma.review.create({
      data: {
        reviewerUserId,
        subjectUserId: subjectUserId || dto.subjectUserId || null,
        courseId: courseId || dto.courseId || null,
        relationshipType: dto.relationshipType,
        relationshipId: dto.relationshipId,
        rating: dto.rating,
        title: dto.title?.trim() || null,
        comment: dto.comment.trim(),
        status: ReviewStatus.PUBLISHED,
      },
      include: {
        reviewer: { select: { id: true, email: true, avatarUrl: true, candidateProfile: { select: { fullName: true } }, employerProfile: { select: { companyName: true } } } },
        subjectUser: { select: { id: true, email: true } },
        course: { select: { id: true, title: true } },
      },
    } as any);

    // Update aggregate ratings non-blockingly
    this.recalculateAggregateRating(review.subjectUserId, review.courseId).catch((err) =>
      this.logger.warn(`Failed to recalculate aggregate rating: ${err.message}`),
    );

    // Notify subject user non-blockingly
    if (review.subjectUserId && review.subjectUserId !== reviewerUserId) {
      this.notificationsService
        .create({
          userId: review.subjectUserId,
          title: 'New Verified Review Received',
          message: `You received a new ${dto.rating}-star review on TalentFlow.`,
        })
        .catch((err) => this.logger.warn(`Failed to dispatch review notification: ${err.message}`));
    }

    return review;
  }

  /**
   * Get single review by ID.
   */
  async getReviewById(id: string) {
    const review = await this.prisma.review.findUnique({
      where: { id },
      include: {
        reviewer: { select: { id: true, email: true, avatarUrl: true, candidateProfile: { select: { fullName: true } }, employerProfile: { select: { companyName: true } } } },
        subjectUser: { select: { id: true, email: true } },
        course: { select: { id: true, title: true } },
      },
    });

    if (!review) {
      throw new NotFoundException(`Review with ID ${id} not found.`);
    }

    return review;
  }

  /**
   * Edit own review (BOLA Guard).
   */
  async updateReview(id: string, reviewerUserId: string, dto: UpdateReviewDto) {
    const review = await this.getReviewById(id);

    if (review.reviewerUserId !== reviewerUserId) {
      throw new ForbiddenException('You can only edit your own reviews.');
    }

    if (dto.rating !== undefined && (dto.rating < 1 || dto.rating > 5)) {
      throw new BadRequestException('Rating must be between 1 and 5.');
    }

    if (dto.comment !== undefined && !dto.comment.trim()) {
      throw new BadRequestException('Review comment cannot be empty.');
    }

    const updated = await this.prisma.review.update({
      where: { id },
      data: {
        ...(dto.rating !== undefined && { rating: dto.rating }),
        ...(dto.title !== undefined && { title: dto.title.trim() }),
        ...(dto.comment !== undefined && { comment: dto.comment.trim() }),
      },
      include: {
        reviewer: { select: { id: true, email: true, avatarUrl: true, candidateProfile: { select: { fullName: true } }, employerProfile: { select: { companyName: true } } } },
      },
    });

    this.recalculateAggregateRating(updated.subjectUserId, updated.courseId).catch((err) =>
      this.logger.warn(`Failed to recalculate aggregate rating: ${err.message}`),
    );

    return updated;
  }

  /**
   * Delete own review (or Admin delete).
   */
  async deleteReview(id: string, userId: string, isAdmin: boolean = false) {
    const review = await this.getReviewById(id);

    if (review.reviewerUserId !== userId && !isAdmin) {
      throw new ForbiddenException('You can only delete your own reviews.');
    }

    await this.prisma.review.delete({
      where: { id },
    });

    this.recalculateAggregateRating(review.subjectUserId, review.courseId).catch((err) =>
      this.logger.warn(`Failed to recalculate aggregate rating: ${err.message}`),
    );

    return { success: true, message: 'Review deleted successfully.' };
  }

  /**
   * Get reviews for a subject user (Candidate, Employer, or Trainer).
   */
  async getReviewsForUser(userId: string) {
    const reviews = await this.prisma.review.findMany({
      where: {
        subjectUserId: userId,
        status: ReviewStatus.PUBLISHED,
      },
      include: {
        reviewer: { select: { id: true, email: true, avatarUrl: true, candidateProfile: { select: { fullName: true } }, employerProfile: { select: { companyName: true } } } },
      },
      orderBy: { createdAt: 'desc' },
    });

    const summary = this.calculateSummary(reviews);
    return { summary, reviews };
  }

  /**
   * Get reviews for a course.
   */
  async getReviewsForCourse(courseId: string) {
    const reviews = await this.prisma.review.findMany({
      where: {
        courseId,
        status: ReviewStatus.PUBLISHED,
      },
      include: {
        reviewer: { select: { id: true, email: true, avatarUrl: true, candidateProfile: { select: { fullName: true } }, employerProfile: { select: { companyName: true } } } },
      },
      orderBy: { createdAt: 'desc' },
    });

    const summary = this.calculateSummary(reviews);
    return { summary, reviews };
  }

  /**
   * Get reviews given by logged-in user.
   */
  async getReviewsGivenBy(userId: string) {
    return this.prisma.review.findMany({
      where: { reviewerUserId: userId },
      include: {
        subjectUser: { select: { id: true, email: true, candidateProfile: { select: { fullName: true } }, employerProfile: { select: { companyName: true } } } },
        course: { select: { id: true, title: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Get reviews received by logged-in user.
   */
  async getReviewsReceivedBy(userId: string) {
    const reviews = await this.prisma.review.findMany({
      where: {
        subjectUserId: userId,
        status: ReviewStatus.PUBLISHED,
      },
      include: {
        reviewer: { select: { id: true, email: true, avatarUrl: true, candidateProfile: { select: { fullName: true } }, employerProfile: { select: { companyName: true } } } },
      },
      orderBy: { createdAt: 'desc' },
    });

    const summary = this.calculateSummary(reviews);
    return { summary, reviews };
  }

  /**
   * Report a review.
   */
  async reportReview(reviewId: string, reporterUserId: string, dto: ReportReviewDto) {
    await this.getReviewById(reviewId);

    const report = await this.prisma.reviewReport.create({
      data: {
        reviewId,
        reporterUserId,
        reason: dto.reason,
        details: dto.details?.trim() || null,
        status: ReviewReportStatus.OPEN,
      },
    });

    return report;
  }

  /**
   * Admin: List all reviews with filters.
   */
  async getAdminReviews(status?: ReviewStatus) {
    return this.prisma.review.findMany({
      where: status ? { status } : undefined,
      include: {
        reviewer: { select: { id: true, email: true, role: true } },
        subjectUser: { select: { id: true, email: true, role: true } },
        course: { select: { id: true, title: true } },
        reports: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Admin: List all reported reviews.
   */
  async getAdminReports(status?: ReviewReportStatus) {
    return this.prisma.reviewReport.findMany({
      where: status ? { status } : undefined,
      include: {
        review: {
          include: {
            reviewer: { select: { id: true, email: true } },
            subjectUser: { select: { id: true, email: true } },
          },
        },
        reporter: { select: { id: true, email: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Admin: Moderate a review.
   */
  async moderateReview(id: string, adminUserId: string, dto: ModerateReviewDto) {
    const review = await this.getReviewById(id);

    const updated = await this.prisma.review.update({
      where: { id },
      data: { status: dto.status },
    });

    await this.auditLogsService.create({
      actionBy: adminUserId,
      action: 'MODERATE_REVIEW',
      resource: id,
      details: { reviewId: id, status: dto.status },
    }).catch(() => {});

    this.recalculateAggregateRating(review.subjectUserId, review.courseId).catch((err) =>
      this.logger.warn(`Failed to recalculate aggregate rating: ${err.message}`),
    );

    return updated;
  }

  /**
   * Admin: Resolve a review report.
   */
  async resolveReport(id: string, adminUserId: string, dto: ResolveReportDto) {
    const report = await this.prisma.reviewReport.findUnique({ where: { id } });
    if (!report) {
      throw new NotFoundException(`Review report with ID ${id} not found.`);
    }

    const updated = await this.prisma.reviewReport.update({
      where: { id },
      data: {
        status: dto.status,
        resolvedAt: new Date(),
        resolvedByUserId: adminUserId,
      },
    });

    await this.auditLogsService.create({
      actionBy: adminUserId,
      action: 'RESOLVE_REVIEW_REPORT',
      resource: id,
      details: { reportId: id, status: dto.status },
    }).catch(() => {});

    return updated;
  }

  /**
   * Helper: Calculate aggregate ratings summary.
   */
  public calculateSummary(reviews: Array<{ rating: number }>) {
    const totalReviews = reviews.length;
    if (totalReviews === 0) {
      return {
        averageRating: 0.0,
        totalReviews: 0,
        ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
      };
    }

    const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
    const averageRating = Math.round((sum / totalReviews) * 10) / 10;

    const ratingDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    reviews.forEach((r) => {
      if (r.rating >= 1 && r.rating <= 5) {
        ratingDistribution[r.rating as 1 | 2 | 3 | 4 | 5]++;
      }
    });

    return {
      averageRating,
      totalReviews,
      ratingDistribution,
    };
  }

  /**
   * Helper: Update aggregate ratings on Course or Profiles.
   */
  private async recalculateAggregateRating(subjectUserId?: string | null, courseId?: string | null) {
    if (courseId) {
      const summary = await this.getReviewsForCourse(courseId);
      await this.prisma.course.update({
        where: { id: courseId },
        data: { rating: summary.summary.averageRating },
      }).catch(() => {});
    }

    if (subjectUserId) {
      const summary = await this.getReviewsForUser(subjectUserId);
      
      // Update Trainer profile rating if user is a trainer
      const trainer = await this.prisma.trainerProfile.findUnique({ where: { userId: subjectUserId } });
      if (trainer) {
        await this.prisma.trainerProfile.update({
          where: { userId: subjectUserId },
          data: { rating: summary.summary.averageRating },
        }).catch(() => {});
      }

      // Update Freelancer profile rating if user is a freelancer
      const freelancer = await this.prisma.freelancerProfile.findUnique({ where: { userId: subjectUserId } });
      if (freelancer) {
        await this.prisma.freelancerProfile.update({
          where: { userId: subjectUserId },
          data: {
            rating: summary.summary.averageRating,
            reviewCount: summary.summary.totalReviews,
          },
        }).catch(() => {});
      }
    }
  }
}

import { Test, TestingModule } from '@nestjs/testing';
import { ReviewsService } from './reviews.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { AuditLogsService } from '../audit-logs/audit-logs.service';
import { ForbiddenException, BadRequestException, ConflictException, NotFoundException } from '@nestjs/common';
import { ReviewRelationshipType, ReviewStatus, ReviewReportStatus } from '@prisma/client';

describe('ReviewsService', () => {
  let service: ReviewsService;
  let prisma: any;
  let notificationsService: any;
  let auditLogsService: any;

  beforeEach(async () => {
    prisma = {
      review: {
        create: jest.fn(),
        findUnique: jest.fn(),
        findFirst: jest.fn(),
        findMany: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
      application: {
        findFirst: jest.fn(),
      },
      enrollment: {
        findFirst: jest.fn(),
      },
      projectRequest: {
        findFirst: jest.fn(),
      },
      reviewReport: {
        create: jest.fn(),
        findUnique: jest.fn(),
        findMany: jest.fn(),
        update: jest.fn(),
      },
      course: {
        update: jest.fn(),
      },
      trainerProfile: {
        findUnique: jest.fn(),
        update: jest.fn(),
      },
      freelancerProfile: {
        findUnique: jest.fn(),
        update: jest.fn(),
      },
    };

    notificationsService = {
      create: jest.fn().mockResolvedValue({ id: 'notif-1' }),
    };

    auditLogsService = {
      logAction: jest.fn().mockResolvedValue({ id: 'audit-1' }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReviewsService,
        { provide: PrismaService, useValue: prisma },
        { provide: NotificationsService, useValue: notificationsService },
        { provide: AuditLogsService, useValue: auditLogsService },
      ],
    }).compile();

    service = module.get<ReviewsService>(ReviewsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateEligibility', () => {
    it('should allow EMPLOYER_TO_CANDIDATE for HIRED application', async () => {
      prisma.application.findFirst.mockResolvedValue({
        id: 'app-1',
        status: 'HIRED',
        candidate: { userId: 'cand-user-1' },
        job: { employer: { userId: 'emp-user-1' } },
        statusHistory: [],
      });

      const res = await service.validateEligibility('emp-user-1', {
        relationshipType: ReviewRelationshipType.EMPLOYER_TO_CANDIDATE,
        relationshipId: 'app-1',
        rating: 5,
        comment: 'Great candidate',
      });

      expect(res.subjectUserId).toBe('cand-user-1');
    });

    it('should reject EMPLOYER_TO_CANDIDATE if application status is PENDING', async () => {
      prisma.application.findFirst.mockResolvedValue({
        id: 'app-1',
        status: 'PENDING',
        candidate: { userId: 'cand-user-1' },
        job: { employer: { userId: 'emp-user-1' } },
        statusHistory: [],
      });

      await expect(
        service.validateEligibility('emp-user-1', {
          relationshipType: ReviewRelationshipType.EMPLOYER_TO_CANDIDATE,
          relationshipId: 'app-1',
          rating: 5,
          comment: 'Great candidate',
        }),
      ).rejects.toThrow(ForbiddenException);
    });

    it('should allow STUDENT_TO_COURSE if student is enrolled', async () => {
      prisma.enrollment.findFirst.mockResolvedValue({
        id: 'enr-1',
        candidate: { userId: 'cand-user-1' },
        courseId: 'course-1',
      });

      const res = await service.validateEligibility('cand-user-1', {
        relationshipType: ReviewRelationshipType.STUDENT_TO_COURSE,
        relationshipId: 'course-1',
        courseId: 'course-1',
        rating: 5,
        comment: 'Awesome course',
      });

      expect(res.courseId).toBe('course-1');
    });

    it('should reject STUDENT_TO_COURSE if student is not enrolled', async () => {
      prisma.enrollment.findFirst.mockResolvedValue(null);

      await expect(
        service.validateEligibility('cand-user-1', {
          relationshipType: ReviewRelationshipType.STUDENT_TO_COURSE,
          relationshipId: 'course-1',
          rating: 5,
          comment: 'Awesome course',
        }),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('createReview', () => {
    it('should reject invalid rating', async () => {
      await expect(
        service.createReview('emp-user-1', {
          relationshipType: ReviewRelationshipType.EMPLOYER_TO_CANDIDATE,
          relationshipId: 'app-1',
          rating: 6,
          comment: 'Too high',
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should reject empty comment', async () => {
      await expect(
        service.createReview('emp-user-1', {
          relationshipType: ReviewRelationshipType.EMPLOYER_TO_CANDIDATE,
          relationshipId: 'app-1',
          rating: 5,
          comment: '   ',
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should reject duplicate review', async () => {
      prisma.review.findUnique.mockResolvedValue({ id: 'rev-existing' });

      await expect(
        service.createReview('emp-user-1', {
          relationshipType: ReviewRelationshipType.EMPLOYER_TO_CANDIDATE,
          relationshipId: 'app-1',
          rating: 5,
          comment: 'Duplicate check',
        }),
      ).rejects.toThrow(ConflictException);
    });

    it('should create valid review and trigger notification', async () => {
      prisma.review.findUnique.mockResolvedValue(null);
      prisma.application.findFirst.mockResolvedValue({
        id: 'app-1',
        status: 'HIRED',
        candidate: { userId: 'cand-user-1' },
        job: { employer: { userId: 'emp-user-1' } },
        statusHistory: [],
      });

      const mockCreated = {
        id: 'rev-1',
        reviewerUserId: 'emp-user-1',
        subjectUserId: 'cand-user-1',
        rating: 5,
        comment: 'Outstanding hire',
        status: ReviewStatus.PUBLISHED,
      };
      prisma.review.create.mockResolvedValue(mockCreated);
      prisma.review.findMany.mockResolvedValue([mockCreated]);

      const res = await service.createReview('emp-user-1', {
        relationshipType: ReviewRelationshipType.EMPLOYER_TO_CANDIDATE,
        relationshipId: 'app-1',
        rating: 5,
        comment: 'Outstanding hire',
      });

      expect(res.id).toBe('rev-1');
      expect(notificationsService.create).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: 'cand-user-1',
          title: 'New Verified Review Received',
        }),
      );
    });
  });

  describe('updateReview BOLA', () => {
    it('should reject edit from non-author', async () => {
      prisma.review.findUnique.mockResolvedValue({
        id: 'rev-1',
        reviewerUserId: 'emp-user-1',
      });

      await expect(
        service.updateReview('rev-1', 'other-user', { comment: 'Hacked' }),
      ).rejects.toThrow(ForbiddenException);
    });

    it('should allow edit from author', async () => {
      prisma.review.findUnique.mockResolvedValue({
        id: 'rev-1',
        reviewerUserId: 'emp-user-1',
        subjectUserId: 'cand-user-1',
      });
      prisma.review.update.mockResolvedValue({
        id: 'rev-1',
        reviewerUserId: 'emp-user-1',
        comment: 'Updated review text',
      });
      prisma.review.findMany.mockResolvedValue([]);

      const updated = await service.updateReview('rev-1', 'emp-user-1', {
        comment: 'Updated review text',
      });

      expect(updated.comment).toBe('Updated review text');
    });
  });

  describe('deleteReview BOLA', () => {
    it('should reject delete from non-author and non-admin', async () => {
      prisma.review.findUnique.mockResolvedValue({
        id: 'rev-1',
        reviewerUserId: 'emp-user-1',
      });

      await expect(service.deleteReview('rev-1', 'other-user', false)).rejects.toThrow(
        ForbiddenException,
      );
    });

    it('should allow delete from admin', async () => {
      prisma.review.findUnique.mockResolvedValue({
        id: 'rev-1',
        reviewerUserId: 'emp-user-1',
        subjectUserId: 'cand-user-1',
      });
      prisma.review.delete.mockResolvedValue({ id: 'rev-1' });
      prisma.review.findMany.mockResolvedValue([]);

      const res = await service.deleteReview('rev-1', 'admin-user', true);
      expect(res.success).toBe(true);
    });
  });

  describe('calculateSummary', () => {
    it('should calculate zero state cleanly', () => {
      const summary = service.calculateSummary([]);
      expect(summary.averageRating).toBe(0.0);
      expect(summary.totalReviews).toBe(0);
      expect(summary.ratingDistribution).toEqual({ 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 });
    });

    it('should calculate average rating and distribution accurately', () => {
      const summary = service.calculateSummary([
        { rating: 5 },
        { rating: 5 },
        { rating: 4 },
      ]);
      expect(summary.totalReviews).toBe(3);
      expect(summary.averageRating).toBe(4.7);
      expect(summary.ratingDistribution[5]).toBe(2);
      expect(summary.ratingDistribution[4]).toBe(1);
    });
  });
});

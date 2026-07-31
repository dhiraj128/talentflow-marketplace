import { Test, TestingModule } from '@nestjs/testing';
import { OffersService } from './offers.service';
import { PrismaService } from '../prisma/prisma.service';
import { AuditLogsService } from '../audit-logs/audit-logs.service';
import { NotificationsService } from '../notifications/notifications.service';
import { ForbiddenException, BadRequestException, ConflictException } from '@nestjs/common';

describe('V1.3 OffersService & RBAC Security Specs', () => {
  let service: OffersService;
  let prisma: PrismaService;

  const mockPrismaService = {
    employerProfile: { findUnique: jest.fn() },
    candidateProfile: { findUnique: jest.fn() },
    application: { findUnique: jest.fn(), update: jest.fn() },
    jobOffer: {
      create: jest.fn(),
      findFirst: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    applicationStatusHistory: { create: jest.fn() },
    $transaction: jest.fn(),
  };

  const mockAuditLogsService = {
    create: jest.fn().mockResolvedValue({ id: 'audit-1' }),
  };

  const mockNotificationsService = {
    notifyOfferEvent: jest.fn().mockResolvedValue(undefined),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OffersService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: AuditLogsService, useValue: mockAuditLogsService },
        { provide: NotificationsService, useValue: mockNotificationsService },
      ],
    }).compile();

    service = module.get<OffersService>(OffersService);
    prisma = module.get<PrismaService>(PrismaService);
    jest.clearAllMocks();
  });

  describe('1. Offer Creation & Sending', () => {
    it('should allow employer to create a draft job offer', async () => {
      mockPrismaService.employerProfile.findUnique.mockResolvedValue({ id: 'emp-1', userId: 'user-emp-1' });
      mockPrismaService.application.findUnique.mockResolvedValue({
        id: 'app-1',
        jobId: 'job-1',
        candidateId: 'cand-1',
        job: { employerId: 'emp-1' },
      });
      mockPrismaService.jobOffer.findFirst.mockResolvedValue(null);
      mockPrismaService.jobOffer.create.mockResolvedValue({
        id: 'offer-1',
        status: 'DRAFT',
        title: 'Senior Engineer Offer',
        salaryAmount: 120000,
      });

      const offer = await service.create(
        {
          applicationId: 'app-1',
          title: 'Senior Engineer Offer',
          salaryAmount: 120000,
          joiningDate: '2026-09-01',
          status: 'DRAFT',
        },
        'user-emp-1',
      );

      expect(offer.id).toBe('offer-1');
      expect(offer.status).toBe('DRAFT');
    });

    it('should reject offer creation if non-owner employer', async () => {
      mockPrismaService.employerProfile.findUnique.mockResolvedValue({ id: 'emp-2', userId: 'user-emp-2' });
      mockPrismaService.application.findUnique.mockResolvedValue({
        id: 'app-1',
        job: { employerId: 'emp-1' },
      });

      await expect(
        service.create(
          {
            applicationId: 'app-1',
            title: 'Senior Engineer Offer',
            salaryAmount: 120000,
            joiningDate: '2026-09-01',
          },
          'user-emp-2',
        ),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('2. Candidate Privacy & Offer State Transitions', () => {
    it('should exclude DRAFT offers when candidate fetches offers', async () => {
      mockPrismaService.candidateProfile.findUnique.mockResolvedValue({ id: 'cand-1', userId: 'user-cand-1' });
      mockPrismaService.jobOffer.findMany.mockResolvedValue([
        { id: 'offer-sent', status: 'SENT', expiresAt: null },
      ]);

      const offers = await service.findAllByCandidate('user-cand-1');
      expect(offers.length).toBe(1);
      expect(mockPrismaService.jobOffer.findMany).toHaveBeenCalledWith({
        where: {
          candidateId: 'cand-1',
          status: { in: ['SENT', 'VIEWED', 'ACCEPTED', 'DECLINED', 'WITHDRAWN', 'EXPIRED'] },
        },
        include: expect.any(Object),
        orderBy: { createdAt: 'desc' },
      });
    });

    it('should transactionally accept offer and update application to HIRED', async () => {
      mockPrismaService.jobOffer.findUnique.mockResolvedValue({
        id: 'offer-1',
        status: 'VIEWED',
        applicationId: 'app-1',
        candidate: { userId: 'user-cand-1' },
        employer: { userId: 'user-emp-1' },
        job: { title: 'Lead Architect' },
        application: { status: 'OFFERED' },
      });

      mockPrismaService.$transaction.mockResolvedValue([
        { id: 'offer-1', status: 'ACCEPTED' },
        { id: 'app-1', status: 'HIRED' },
        { id: 'hist-1' },
      ]);

      const result = await service.acceptOffer('offer-1', 'user-cand-1');
      expect(result.status).toBe('ACCEPTED');
      expect(mockNotificationsService.notifyOfferEvent).toHaveBeenCalledWith('offer-1', 'ACCEPTED');
    });

    it('should reject candidate accepting expired offer', async () => {
      const pastDate = new Date(Date.now() - 86400000);
      mockPrismaService.jobOffer.findUnique.mockResolvedValue({
        id: 'offer-expired',
        status: 'SENT',
        expiresAt: pastDate,
        candidate: { userId: 'user-cand-1' },
        employer: { userId: 'user-emp-1' },
      });
      mockPrismaService.jobOffer.update.mockResolvedValue({ id: 'offer-expired', status: 'EXPIRED' });

      await expect(service.acceptOffer('offer-expired', 'user-cand-1')).rejects.toThrow(BadRequestException);
    });
  });
});

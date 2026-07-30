import { Test, TestingModule } from '@nestjs/testing';
import { ApplicationsService } from './applications.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { ApplicationStatus } from '@prisma/client';
import { isValidTransition } from './state-machine';

describe('V1.1 Hiring Pipeline & State Machine Specs', () => {
  let service: ApplicationsService;
  let prisma: PrismaService;

  const mockPrismaService = {
    application: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    candidateSkill: { findMany: jest.fn().mockResolvedValue([]) },
    jobSkill: { findMany: jest.fn().mockResolvedValue([]) },
    candidateProfile: { findUnique: jest.fn() },
    employerProfile: { findUnique: jest.fn() },
    applicationStatusHistory: { create: jest.fn(), findMany: jest.fn() },
    employerCandidateNote: { create: jest.fn(), findMany: jest.fn(), delete: jest.fn(), findUnique: jest.fn() },
    candidateTag: { upsert: jest.fn(), findMany: jest.fn() },
    applicationTagAssignment: { upsert: jest.fn(), deleteMany: jest.fn() },
    auditLog: { create: jest.fn().mockResolvedValue({}) },
  };

  const mockNotificationsService = {
    notifyApplicationSubmitted: jest.fn().mockResolvedValue(undefined),
    notifyApplicationStatusChanged: jest.fn().mockResolvedValue(undefined),
    createNotification: jest.fn().mockResolvedValue(undefined),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ApplicationsService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: NotificationsService, useValue: mockNotificationsService },
      ],
    }).compile();

    service = module.get<ApplicationsService>(ApplicationsService);
    prisma = module.get<PrismaService>(PrismaService);
    jest.clearAllMocks();
  });

  describe('1. Server-Side State Machine Transition Rules', () => {
    it('should allow valid stage transitions (APPLIED -> SHORTLISTED -> INTERVIEWING -> OFFERED -> HIRED)', () => {
      expect(isValidTransition(ApplicationStatus.APPLIED, ApplicationStatus.SHORTLISTED)).toBe(true);
      expect(isValidTransition(ApplicationStatus.SHORTLISTED, ApplicationStatus.INTERVIEWING)).toBe(true);
      expect(isValidTransition(ApplicationStatus.INTERVIEWING, ApplicationStatus.OFFERED)).toBe(true);
      expect(isValidTransition(ApplicationStatus.OFFERED, ApplicationStatus.HIRED)).toBe(true);
    });

    it('should reject invalid or backwards transitions from terminal states', () => {
      expect(isValidTransition(ApplicationStatus.HIRED, ApplicationStatus.APPLIED)).toBe(false);
      expect(isValidTransition(ApplicationStatus.REJECTED, ApplicationStatus.SHORTLISTED)).toBe(false);
      expect(isValidTransition(ApplicationStatus.WITHDRAWN, ApplicationStatus.INTERVIEWING)).toBe(false);
    });
  });

  describe('2. Employer Application Status Transition API', () => {
    it('should reject status update if user is not the owning Employer', async () => {
      mockPrismaService.employerProfile.findUnique.mockResolvedValue({ id: 'emp-101', userId: 'user-emp-101' });
      mockPrismaService.application.findUnique.mockResolvedValue({
        id: 'app-1',
        status: ApplicationStatus.APPLIED,
        job: { employerId: 'emp-999', employer: { id: 'emp-999', userId: 'user-emp-999' } },
      });

      await expect(
        service.updateStatus('app-1', ApplicationStatus.SHORTLISTED, { sub: 'user-emp-101', role: 'EMPLOYER' }),
      ).rejects.toThrow(ForbiddenException);
    });

    it('should update status, log history, and trigger notification on valid transition', async () => {
      mockPrismaService.employerProfile.findUnique.mockResolvedValue({ id: 'emp-101', userId: 'user-emp-101' });
      mockPrismaService.application.findUnique.mockResolvedValue({
        id: 'app-1',
        status: ApplicationStatus.APPLIED,
        job: { employerId: 'emp-101', employer: { id: 'emp-101', userId: 'user-emp-101' } },
      });
      mockPrismaService.application.update.mockResolvedValue({ id: 'app-1', status: ApplicationStatus.SHORTLISTED });
      mockPrismaService.applicationStatusHistory.create.mockResolvedValue({ id: 'hist-1' });

      const result = await service.updateStatus(
        'app-1',
        ApplicationStatus.SHORTLISTED,
        { sub: 'user-emp-101', role: 'EMPLOYER' },
        'Candidate shortlisted after review',
      );

      expect(result.status).toBe(ApplicationStatus.SHORTLISTED);
      expect(mockPrismaService.applicationStatusHistory.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          applicationId: 'app-1',
          fromStatus: ApplicationStatus.APPLIED,
          toStatus: ApplicationStatus.SHORTLISTED,
          changedByUserId: 'user-emp-101',
          changedByRole: 'EMPLOYER',
        }),
      });
      expect(mockNotificationsService.notifyApplicationStatusChanged).toHaveBeenCalledWith('app-1', ApplicationStatus.SHORTLISTED);
    });
  });

  describe('3. Candidate Application Withdrawal', () => {
    it('should allow candidate to withdraw own application in non-terminal state', async () => {
      mockPrismaService.application.findUnique.mockResolvedValue({
        id: 'app-1',
        status: ApplicationStatus.SHORTLISTED,
        candidate: { userId: 'user-cand-1' },
        job: { title: 'Senior Dev', employer: { userId: 'user-emp-101' } },
      });
      mockPrismaService.application.update.mockResolvedValue({ id: 'app-1', status: ApplicationStatus.WITHDRAWN });

      const result = await service.withdraw('app-1', { sub: 'user-cand-1', role: 'CANDIDATE' }, 'Found another role');

      expect(result.status).toBe(ApplicationStatus.WITHDRAWN);
      expect(mockPrismaService.applicationStatusHistory.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          toStatus: ApplicationStatus.WITHDRAWN,
          changedByRole: 'CANDIDATE',
        }),
      });
    });

    it('should reject withdrawal for another candidates application (IDOR Protection)', async () => {
      mockPrismaService.application.findUnique.mockResolvedValue({
        id: 'app-1',
        status: ApplicationStatus.APPLIED,
        candidate: { userId: 'user-cand-1' },
      });

      await expect(
        service.withdraw('app-1', { sub: 'user-cand-ATTACKER', role: 'CANDIDATE' }),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('4. Employer Private Candidate Notes Security', () => {
    it('should allow employer to create private note on application under their job', async () => {
      mockPrismaService.employerProfile.findUnique.mockResolvedValue({ id: 'emp-101', userId: 'user-emp-101' });
      mockPrismaService.application.findUnique.mockResolvedValue({
        id: 'app-1',
        job: { employerId: 'emp-101' },
      });
      mockPrismaService.employerCandidateNote.create.mockResolvedValue({ id: 'note-1', content: 'Strong candidate' });

      const note = await service.createNote('app-1', 'Strong candidate', { sub: 'user-emp-101', role: 'EMPLOYER' });
      expect(note.content).toBe('Strong candidate');
    });

    it('should prevent candidate from reading private employer notes (BOLA Protection)', async () => {
      mockPrismaService.application.findUnique.mockResolvedValue({
        id: 'app-1',
        candidate: { userId: 'user-cand-1' },
        job: { employer: { userId: 'user-emp-101' } },
        notes: [{ id: 'note-1', content: 'Internal salary budget note' }],
      });

      const app = await service.findOne('app-1', { sub: 'user-cand-1', role: 'CANDIDATE' });
      expect(app.notes).toEqual([]); // Notes hidden from candidate
    });
  });
});

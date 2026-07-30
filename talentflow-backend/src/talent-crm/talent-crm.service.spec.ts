import { Test, TestingModule } from '@nestjs/testing';
import { TalentCrmService } from './talent-crm.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { ApplicationsService } from '../applications/applications.service';
import { BadRequestException, ForbiddenException, NotFoundException, ConflictException } from '@nestjs/common';
import { InvitationStatus } from '@prisma/client';

describe('V1.2 Employer Talent CRM & Invitations Specs', () => {
  let service: TalentCrmService;
  let prisma: PrismaService;

  const mockPrismaService = {
    employerProfile: { findUnique: jest.fn() },
    candidateProfile: { findUnique: jest.fn(), findMany: jest.fn(), count: jest.fn() },
    savedCandidate: { upsert: jest.fn(), deleteMany: jest.fn(), findMany: jest.fn(), count: jest.fn() },
    talentPool: { create: jest.fn(), findMany: jest.fn(), findUnique: jest.fn(), update: jest.fn(), delete: jest.fn(), count: jest.fn() },
    talentPoolMember: { upsert: jest.fn(), deleteMany: jest.fn() },
    job: { findUnique: jest.fn() },
    application: { findUnique: jest.fn() },
    candidateInvitation: { create: jest.fn(), findFirst: jest.fn(), findMany: jest.fn(), findUnique: jest.fn(), update: jest.fn(), count: jest.fn() },
    auditLog: { create: jest.fn().mockResolvedValue({}) },
  };

  const mockNotificationsService = {
    create: jest.fn().mockResolvedValue(undefined),
  };

  const mockApplicationsService = {
    create: jest.fn().mockResolvedValue({ id: 'app-converted-101', status: 'APPLIED' }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TalentCrmService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: NotificationsService, useValue: mockNotificationsService },
        { provide: ApplicationsService, useValue: mockApplicationsService },
      ],
    }).compile();

    service = module.get<TalentCrmService>(TalentCrmService);
    prisma = module.get<PrismaService>(PrismaService);
    jest.clearAllMocks();
  });

  describe('1. Saved Candidates & Privacy Control', () => {
    it('should save candidate if discoverable', async () => {
      mockPrismaService.employerProfile.findUnique.mockResolvedValue({ id: 'emp-1', userId: 'user-emp-1' });
      mockPrismaService.candidateProfile.findUnique.mockResolvedValue({ id: 'cand-1', profileDiscoverable: true });
      mockPrismaService.savedCandidate.upsert.mockResolvedValue({ id: 'saved-1', employerId: 'emp-1', candidateId: 'cand-1', isFavorite: true });

      const res = await service.saveCandidate('cand-1', true, { sub: 'user-emp-1', role: 'EMPLOYER' });
      expect(res.isFavorite).toBe(true);
    });

    it('should reject saving non-discoverable candidate', async () => {
      mockPrismaService.employerProfile.findUnique.mockResolvedValue({ id: 'emp-1', userId: 'user-emp-1' });
      mockPrismaService.candidateProfile.findUnique.mockResolvedValue({ id: 'cand-hidden', profileDiscoverable: false });

      await expect(
        service.saveCandidate('cand-hidden', false, { sub: 'user-emp-1', role: 'EMPLOYER' }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('2. Employer Talent Pools Isolation', () => {
    it('should allow employer to create talent pool', async () => {
      mockPrismaService.employerProfile.findUnique.mockResolvedValue({ id: 'emp-1', userId: 'user-emp-1' });
      mockPrismaService.talentPool.create.mockResolvedValue({ id: 'pool-1', name: 'Frontend Devs', employerId: 'emp-1' });

      const pool = await service.createPool('Frontend Devs', 'Vue/React talent', { sub: 'user-emp-1', role: 'EMPLOYER' });
      expect(pool.name).toBe('Frontend Devs');
    });

    it('should prevent Employer B from accessing Employer A talent pool (BOLA Protection)', async () => {
      mockPrismaService.employerProfile.findUnique.mockResolvedValue({ id: 'emp-2', userId: 'user-emp-2' }); // Employer B
      mockPrismaService.talentPool.findUnique.mockResolvedValue({ id: 'pool-1', employerId: 'emp-1' }); // Employer A pool

      await expect(
        service.getPool('pool-1', { sub: 'user-emp-2', role: 'EMPLOYER' }),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('3. Invite-to-Apply Workflow & Conversion', () => {
    it('should create candidate invitation and trigger notification', async () => {
      mockPrismaService.employerProfile.findUnique.mockResolvedValue({ id: 'emp-1', userId: 'user-emp-1', companyName: 'Acme Corp' });
      mockPrismaService.job.findUnique.mockResolvedValue({ id: 'job-1', employerId: 'emp-1', title: 'Senior Dev' });
      mockPrismaService.candidateProfile.findUnique.mockResolvedValue({ id: 'cand-1', userId: 'user-cand-1', profileDiscoverable: true });
      mockPrismaService.application.findUnique.mockResolvedValue(null);
      mockPrismaService.candidateInvitation.findFirst.mockResolvedValue(null);
      mockPrismaService.candidateInvitation.create.mockResolvedValue({ id: 'inv-1', status: InvitationStatus.PENDING });

      const inv = await service.createInvitation('cand-1', 'job-1', 'Join our team!', { sub: 'user-emp-1', role: 'EMPLOYER' });
      expect(inv.status).toBe(InvitationStatus.PENDING);
      expect(mockNotificationsService.create).toHaveBeenCalled();
    });

    it('should reject invitation if candidate already applied', async () => {
      mockPrismaService.employerProfile.findUnique.mockResolvedValue({ id: 'emp-1', userId: 'user-emp-1' });
      mockPrismaService.job.findUnique.mockResolvedValue({ id: 'job-1', employerId: 'emp-1' });
      mockPrismaService.candidateProfile.findUnique.mockResolvedValue({ id: 'cand-1', profileDiscoverable: true });
      mockPrismaService.application.findUnique.mockResolvedValue({ id: 'existing-app-1' }); // Already applied

      await expect(
        service.createInvitation('cand-1', 'job-1', 'Message', { sub: 'user-emp-1', role: 'EMPLOYER' }),
      ).rejects.toThrow(ConflictException);
    });

    it('should allow candidate to accept invitation and convert to V1.1 Hiring Pipeline application', async () => {
      mockPrismaService.candidateProfile.findUnique.mockResolvedValue({ id: 'cand-1', userId: 'user-cand-1' });
      mockPrismaService.candidateInvitation.findUnique.mockResolvedValue({ id: 'inv-1', candidateId: 'cand-1', jobId: 'job-1', status: InvitationStatus.PENDING });
      mockPrismaService.candidateInvitation.update.mockResolvedValue({ id: 'inv-1', status: InvitationStatus.ACCEPTED });

      const app = await service.acceptInvitationAndApply('inv-1', { sub: 'user-cand-1', role: 'CANDIDATE' });

      expect(mockApplicationsService.create).toHaveBeenCalledWith({ candidateId: 'cand-1', jobId: 'job-1' });
      expect(app.id).toBe('app-converted-101');
    });

    it('should prevent Candidate B from declining Candidate A invitation (IDOR Protection)', async () => {
      mockPrismaService.candidateProfile.findUnique.mockResolvedValue({ id: 'cand-2', userId: 'user-cand-2' }); // Candidate B
      mockPrismaService.candidateInvitation.findUnique.mockResolvedValue({ id: 'inv-1', candidateId: 'cand-1' }); // Candidate A inv

      await expect(
        service.declineInvitation('inv-1', { sub: 'user-cand-2', role: 'CANDIDATE' }),
      ).rejects.toThrow(ForbiddenException);
    });
  });
});

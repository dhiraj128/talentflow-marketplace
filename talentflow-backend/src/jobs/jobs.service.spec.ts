import { Test, TestingModule } from '@nestjs/testing';
import { JobsService } from './jobs.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { MatchingService } from '../matching/matching.service';
import { ForbiddenException, NotFoundException } from '@nestjs/common';

describe('V1.2.1 Real Data JobsService & Recommendation Specs', () => {
  let service: JobsService;
  let prisma: PrismaService;

  const mockPrismaService = {
    job: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    employerProfile: { findUnique: jest.fn() },
    candidateProfile: { findUnique: jest.fn() },
    savedJob: { upsert: jest.fn(), deleteMany: jest.fn(), findMany: jest.fn() },
    application: { create: jest.fn(), findUnique: jest.fn() },
    user: { findUnique: jest.fn() },
  };

  const mockNotificationsService = {
    notifyApplicationSubmitted: jest.fn().mockResolvedValue(undefined),
  };

  const realMatchingService = new MatchingService(null as any);
  const mockMatchingService = {
    calculateJobCandidateMatch: (job: any, candidate: any) => realMatchingService.calculateJobCandidateMatch(job, candidate),
    getRecommendedCandidatesForJob: jest.fn().mockResolvedValue({ data: [], total: 0 }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JobsService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: NotificationsService, useValue: mockNotificationsService },
        { provide: MatchingService, useValue: mockMatchingService },
      ],
    }).compile();

    service = module.get<JobsService>(JobsService);
    prisma = module.get<PrismaService>(PrismaService);
    jest.clearAllMocks();
  });

  describe('1. Saved Jobs Functionality', () => {
    it('should allow candidate to save a valid job', async () => {
      mockPrismaService.candidateProfile.findUnique.mockResolvedValue({ id: 'cand-1', userId: 'user-cand-1' });
      mockPrismaService.job.findUnique.mockResolvedValue({ id: 'job-1', title: 'React Dev' });
      mockPrismaService.savedJob.upsert.mockResolvedValue({ id: 'sj-1', candidateId: 'cand-1', jobId: 'job-1' });

      const res = await service.saveJob('job-1', 'user-cand-1');
      expect(res.id).toBe('sj-1');
      expect(mockPrismaService.savedJob.upsert).toHaveBeenCalledWith({
        where: { candidateId_jobId: { candidateId: 'cand-1', jobId: 'job-1' } },
        create: { candidateId: 'cand-1', jobId: 'job-1' },
        update: {},
      });
    });

    it('should reject saving job if non-candidate', async () => {
      mockPrismaService.candidateProfile.findUnique.mockResolvedValue(null);

      await expect(service.saveJob('job-1', 'user-emp-1')).rejects.toThrow(ForbiddenException);
    });

    it('should allow candidate to unsave a job', async () => {
      mockPrismaService.candidateProfile.findUnique.mockResolvedValue({ id: 'cand-1', userId: 'user-cand-1' });
      mockPrismaService.savedJob.deleteMany.mockResolvedValue({ count: 1 });

      const res = await service.unsaveJob('job-1', 'user-cand-1');
      expect(res.success).toBe(true);
    });

    it('should return saved jobs list for candidate', async () => {
      mockPrismaService.candidateProfile.findUnique.mockResolvedValue({ id: 'cand-1', userId: 'user-cand-1' });
      mockPrismaService.savedJob.findMany.mockResolvedValue([
        {
          id: 'sj-1',
          createdAt: new Date(),
          job: {
            id: 'job-1',
            title: 'Senior Frontend Engineer',
            location: 'Remote',
            salaryRange: '$120k',
            type: 'Full-time',
            employer: { companyName: 'Acme Corp' },
          },
        },
      ]);

      const list = await service.getSavedJobs('user-cand-1');
      expect(list.length).toBe(1);
      expect(list[0].company).toBe('Acme Corp');
    });
  });

  describe('2. Deterministic Recommendation Engine', () => {
    it('should calculate real match score based on candidate skills', async () => {
      mockPrismaService.candidateProfile.findUnique.mockResolvedValue({
        id: 'cand-1',
        userId: 'user-cand-1',
        location: 'Remote',
        skills: [{ skill: { name: 'React' } }, { skill: { name: 'TypeScript' } }],
      });

      mockPrismaService.job.findMany.mockResolvedValue([
        {
          id: 'job-1',
          title: 'Frontend Engineer',
          location: 'Remote',
          salaryRange: '$130k',
          type: 'Full-time',
          employer: { companyName: 'Stitch Tech' },
          requiredSkills: [{ skill: { name: 'React' } }, { skill: { name: 'TypeScript' } }],
        },
      ]);

      const res = await service.getRecommendedJobs('user-cand-1');
      expect(res.data.length).toBe(1);
      expect(res.data[0].matchScore).toBeGreaterThanOrEqual(80);
      expect(res.data[0].matchingReasons.length).toBeGreaterThan(0);
    });

    it('should return 50% base score for job with zero matching skills', async () => {
      mockPrismaService.candidateProfile.findUnique.mockResolvedValue({
        id: 'cand-1',
        userId: 'user-cand-1',
        location: 'Chicago',
        skills: [],
      });

      mockPrismaService.job.findMany.mockResolvedValue([
        {
          id: 'job-1',
          title: 'DevOps Architect',
          location: 'New York',
          employer: { companyName: 'CloudCorp' },
          requiredSkills: [{ skill: { name: 'Kubernetes' } }],
        },
      ]);

      const res = await service.getRecommendedJobs('user-cand-1');
      expect(res.data.length).toBe(1);
      expect(res.data[0].matchScore).toBe(50);
    });
  });
});

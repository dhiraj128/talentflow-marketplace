import { Test, TestingModule } from '@nestjs/testing';
import { AnalyticsService } from './analytics.service';
import { PrismaService } from '../prisma/prisma.service';

describe('Multi-Role Dashboard Analytics Unit Specs', () => {
  let service: AnalyticsService;
  let prisma: any;

  beforeEach(async () => {
    prisma = {
      user: { count: jest.fn().mockResolvedValue(150), findMany: jest.fn().mockResolvedValue([]) },
      employerProfile: {
        count: jest.fn().mockResolvedValue(25),
        findUnique: jest.fn().mockResolvedValue({ id: 'emp-123', userId: 'user-emp' }),
      },
      freelancerProfile: {
        count: jest.fn().mockResolvedValue(40),
        findUnique: jest.fn().mockResolvedValue({ id: 'free-123', userId: 'user-free' }),
      },
      trainerProfile: {
        count: jest.fn().mockResolvedValue(10),
        findUnique: jest.fn().mockResolvedValue({ id: 'trn-123', userId: 'user-trn' }),
      },
      candidateProfile: {
        count: jest.fn().mockResolvedValue(75),
        findUnique: jest.fn().mockResolvedValue({ id: 'cand-123', userId: 'user-cand', fullName: 'Candidate A', skills: [] }),
        findMany: jest.fn().mockResolvedValue([]),
      },
      job: {
        count: jest.fn().mockImplementation((args) => {
          if (!args) return Promise.resolve(12); // total jobsPosted = 12
          if (args?.where?.status === 'PUBLISHED') return Promise.resolve(8); // live activeJobs = 8
          if (args?.where?.status === 'DRAFT') return Promise.resolve(3); // draft = 3
          if (args?.where?.status === 'CLOSED') return Promise.resolve(1); // closed = 1
          return Promise.resolve(0);
        }),
        findMany: jest.fn().mockResolvedValue([]),
      },
      course: {
        count: jest.fn().mockResolvedValue(15),
        findMany: jest.fn().mockResolvedValue([{ id: 'course-1' }]),
      },
      application: {
        count: jest.fn().mockResolvedValue(5),
        findMany: jest.fn().mockResolvedValue([]),
      },
      savedJob: {
        count: jest.fn().mockResolvedValue(4),
      },
      candidateInvitation: {
        count: jest.fn().mockResolvedValue(2),
      },
      coupon: { count: jest.fn().mockResolvedValue(5) },
      subscription: { count: jest.fn().mockResolvedValue(12) },
      projectRequest: {
        findMany: jest.fn().mockResolvedValue([
          { id: 'p1', status: 'ACCEPTED', budget: 1500 },
          { id: 'p2', status: 'COMPLETED', budget: 2500 },
        ]),
      },
      review: {
        findMany: jest.fn().mockResolvedValue([{ rating: 5 }, { rating: 4 }]),
      },
      enrollment: {
        count: jest.fn().mockResolvedValue(10),
      },
      certificate: {
        count: jest.fn().mockResolvedValue(8),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AnalyticsService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<AnalyticsService>(AnalyticsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('getAdminDashboard should calculate activeJobs (PUBLISHED) separately from jobsPosted (TOTAL)', async () => {
    const dashboard = await service.getAdminDashboard();
    expect(dashboard.stats.jobsPosted).toBe(12);
    expect(dashboard.stats.activeJobs).toBe(8);
    expect(dashboard.stats.publishedJobs).toBe(8);
    expect(dashboard.stats.pendingJobs).toBe(3);
  });

  it('getCandidateDashboard should query real savedJobs and recruiterInvites from Prisma', async () => {
    const dashboard = await service.getCandidateDashboard('user-cand');
    expect(dashboard.stats.savedJobs).toBe(4);
    expect(dashboard.stats.recruiterInvites).toBe(2);
    expect(dashboard.stats.activeApplications).toBe(5);
  });

  it('getEmployerDashboard should return accurate job status breakdowns', async () => {
    const dashboard = await service.getEmployerDashboard('user-emp');
    expect(dashboard.stats).toBeDefined();
    expect(dashboard.stats.totalJobs).toBe(0);
    expect(dashboard.stats.activeJobs).toBe(0);
  });

  it('getFreelancerDashboard should return accurate project and earnings stats', async () => {
    const dashboard = await service.getFreelancerDashboard('user-free');
    expect(dashboard.stats.activeProjects).toBe(1);
    expect(dashboard.stats.completedProjects).toBe(1);
    expect(dashboard.stats.earnings).toBe(2500);
    expect(dashboard.stats.rating).toBe('4.5');
  });

  it('getTrainerDashboard should return real courseRating from Prisma Review table', async () => {
    const dashboard = await service.getTrainerDashboard('user-trn');
    expect(dashboard.courseRating).toBe(4.5);
    expect(dashboard.totalStudents).toBe(10);
  });
});

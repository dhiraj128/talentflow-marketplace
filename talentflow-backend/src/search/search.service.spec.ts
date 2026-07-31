import { Test, TestingModule } from '@nestjs/testing';
import { SearchService } from './search.service';
import { PrismaService } from '../prisma/prisma.service';

describe('SearchService Real Data Integrity', () => {
  let service: SearchService;
  let prisma: any;

  beforeEach(async () => {
    prisma = {
      candidateProfile: {
        findMany: jest.fn().mockResolvedValue([
          {
            id: 'cand-1',
            userId: 'user-1',
            fullName: 'Jane Doe',
            title: 'Full Stack Engineer',
            location: 'San Francisco, CA',
            profileDiscoverable: true,
            skills: [{ skill: { name: 'React' } }, { skill: { name: 'TypeScript' } }],
            createdAt: new Date(),
          },
        ]),
      },
      freelancerProfile: {
        findMany: jest.fn().mockResolvedValue([
          {
            id: 'free-1',
            userId: 'user-2',
            fullName: 'Alex Smith',
            title: 'UI/UX Designer',
            location: 'Remote',
            hourlyRate: 85,
            skills: [{ skill: { name: 'Figma' } }],
            createdAt: new Date(),
          },
        ]),
      },
      job: {
        findMany: jest.fn().mockResolvedValue([
          {
            id: 'job-1',
            title: 'Senior Node Developer',
            location: 'Remote',
            salaryRange: '$120k - $150k',
            type: 'Full-time',
            createdAt: new Date(),
            employer: { companyName: 'Acme Corp', logoUrl: 'https://example.com/logo.png' },
            requiredSkills: [{ skill: { name: 'Node.js' } }],
          },
        ]),
      },
      course: {
        findMany: jest.fn().mockResolvedValue([
          {
            id: 'course-1',
            title: 'Advanced NestJS Architecture',
            rating: 4.9,
            studentCount: 120,
            price: 99,
            level: 'Intermediate',
            trainer: { fullName: 'John Trainer' },
          },
        ]),
      },
      review: {
        aggregate: jest.fn().mockResolvedValue({
          _avg: { rating: 4.7 },
          _count: { rating: 12 },
        }),
      },
      projectRequest: {
        count: jest.fn().mockResolvedValue(8),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SearchService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<SearchService>(SearchService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('searchTalent should return real Prisma profile fields without static fallback values', async () => {
    const results = await service.searchTalent('Jane');
    expect(results).toHaveLength(1);
    expect(results[0].name).toBe('Jane Doe');
    expect(results[0].skills).toEqual(['React', 'TypeScript']);
    expect(results[0].rating).toBe(4.7);
    expect(results[0].totalReviews).toBe(12);
  });

  it('searchFreelancers should return real hourly rate, completed jobs, and skills', async () => {
    const results = await service.searchFreelancers('Alex');
    expect(results).toHaveLength(1);
    expect(results[0].name).toBe('Alex Smith');
    expect(results[0].hourlyRate).toBe(85);
    expect(results[0].completedJobs).toBe(8);
    expect(results[0].skills).toEqual(['Figma']);
    expect(results[0].rating).toBe(4.7);
  });

  it('searchUnified should combine Jobs, Talent, Freelancers, and Courses', async () => {
    const unified = await service.searchUnified('Developer');
    expect(unified.totalResults).toBe(4);
    expect(unified.jobs).toHaveLength(1);
    expect(unified.talent).toHaveLength(1);
    expect(unified.freelancers).toHaveLength(1);
    expect(unified.courses).toHaveLength(1);
  });
});

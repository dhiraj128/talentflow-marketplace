import { MatchingService } from './matching.service';

describe('MatchingService', () => {
  let service: MatchingService;
  let mockPrisma: any;

  beforeEach(() => {
    mockPrisma = {
      job: { findUnique: jest.fn() },
      candidateProfile: { findMany: jest.fn() },
      employerProfile: { findUnique: jest.fn() },
      user: { findUnique: jest.fn() },
    };
    service = new MatchingService(mockPrisma);
  });

  it('should calculate deterministic match score and explainable reasons for high matching skills', () => {
    const job = {
      title: 'Senior React Developer',
      location: 'Mumbai (Remote)',
      requiredSkills: [{ skill: { name: 'React' } }, { skill: { name: 'TypeScript' } }],
    };

    const candidate = {
      fullName: 'Anita Roy',
      title: 'Frontend Engineer',
      location: 'Mumbai',
      skills: [{ skill: { name: 'React' } }, { skill: { name: 'TypeScript' } }],
      experience: [{ title: 'React Developer' }],
      education: [{ degree: 'B.Tech CS' }],
      bio: 'Passionate developer',
      resumeUrl: 'https://s3.resume',
    };

    const result = service.calculateJobCandidateMatch(job, candidate);

    expect(result.matchScore).toBeGreaterThanOrEqual(80);
    expect(result.matchReasons.length).toBeGreaterThan(0);
    expect(result.matchReasons.some((r) => r.includes('skills match'))).toBe(true);
  });

  it('should calculate lower match score for candidate with no skill overlap', () => {
    const job = {
      title: 'Java Backend Architect',
      location: 'Delhi',
      requiredSkills: [{ skill: { name: 'Java' } }, { skill: { name: 'Spring Boot' } }],
    };

    const candidate = {
      fullName: 'Samir Verma',
      skills: [{ skill: { name: 'Figma' } }],
    };

    const result = service.calculateJobCandidateMatch(job, candidate);

    expect(result.matchScore).toBeLessThan(60);
  });

  it('should reject employer recommendation access if employer does not own the job', async () => {
    mockPrisma.job.findUnique.mockResolvedValue({ id: 'job-1', employerId: 'employer-A' });
    mockPrisma.employerProfile.findUnique.mockResolvedValue({ id: 'employer-B', userId: 'user-B' });
    mockPrisma.user.findUnique.mockResolvedValue({ id: 'user-B', role: 'EMPLOYER' });

    await expect(
      service.getRecommendedCandidatesForJob('job-1', 'user-B'),
    ).rejects.toThrow();
  });
});

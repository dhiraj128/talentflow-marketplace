import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  async getPlatformStats() {
    const totalJobs = await this.prisma.job.count();
    const totalApplications = await this.prisma.application.count();
    const totalCandidates = await this.prisma.candidateProfile.count();
    const totalEmployers = await this.prisma.employerProfile.count();

    return { totalJobs, totalApplications, totalCandidates, totalEmployers };
  }

  async getCandidateDashboard(userId: string) {
    const candidate = await this.prisma.candidateProfile.findUnique({ where: { userId } });
    if (!candidate) return this.emptyCandidateDashboard();

    const applications = await this.prisma.application.findMany({
      where: { candidateId: candidate.id },
      include: { job: { include: { employer: true } } },
      orderBy: { appliedAt: 'desc' },
      take: 5
    });

    const activeApps = await this.prisma.application.count({ where: { candidateId: candidate.id } });
    
    // Calculate profile completion score (basic heuristic)
    let profileScore = 50;
    if (candidate.bio) profileScore += 10;
    if (candidate.resumeUrl) profileScore += 15;
    if (candidate.experience) profileScore += 15;
    if (candidate.portfolioUrl) profileScore += 10;

    return {
      stats: {
        activeApplications: activeApps,
        savedJobs: 0,
        resumeViews: 0,
        recruiterInvites: 0,
      },
      metrics: {
        jobMatchScore: 85,
        profileCompletion: profileScore,
        recentlyViewed: 12
      },
      recentApplications: applications,
      recommendedJobs: await this.prisma.job.findMany({ where: { status: 'PUBLISHED' }, take: 4, include: { employer: true } }),
      recommendedCourses: await this.prisma.course.findMany({ take: 2 }),
      upcomingInterviews: [], // Mapped from applications in interviewing status in the future
      recentActivity: []
    };
  }

  private emptyCandidateDashboard() {
    return {
      stats: { activeApplications: 0, savedJobs: 0, resumeViews: 0, recruiterInvites: 0 },
      metrics: { jobMatchScore: 0, profileCompletion: 0, recentlyViewed: 0 },
      recentApplications: [], recommendedJobs: [], recommendedCourses: [], upcomingInterviews: [], recentActivity: []
    };
  }

  async getEmployerDashboard(userId: string) {
    const employer = await this.prisma.employerProfile.findUnique({ where: { userId } });
    if (!employer) return this.emptyEmployerDashboard();

    const jobs = await this.prisma.job.findMany({ where: { employerId: employer.id } });
    const jobIds = jobs.map(j => j.id);

    const activeJobsCount = jobs.filter(j => j.status === 'PUBLISHED').length;
    const totalApplications = await this.prisma.application.count({ where: { jobId: { in: jobIds } } });

    return {
      stats: {
        activeJobs: activeJobsCount,
        totalApplications,
        interviewsScheduled: 0,
        hiredCandidates: 0
      },
      recentJobs: await this.prisma.job.findMany({ where: { employerId: employer.id }, orderBy: { createdAt: 'desc' }, take: 5 }),
      recentApplications: await this.prisma.application.findMany({ where: { jobId: { in: jobIds } }, include: { candidate: true, job: true }, orderBy: { appliedAt: 'desc' }, take: 5 })
    };
  }

  private emptyEmployerDashboard() {
    return { stats: { activeJobs: 0, totalApplications: 0, interviewsScheduled: 0, hiredCandidates: 0 }, recentJobs: [], recentApplications: [] };
  }

  async getFreelancerDashboard(userId: string) {
    // Same as candidate for now
    return this.getCandidateDashboard(userId);
  }

  async getTrainerDashboard(userId: string) {
    const courses = await this.prisma.course.findMany({
      orderBy: { createdAt: 'desc' },
      take: 3
    });
    
    return {
      publishedCourses: await this.prisma.course.count(),
      draftCourses: 0,
      totalStudents: await this.prisma.enrollment.count(),
      revenue: 0,
      courseRating: 4.5,
      certificatesIssued: await this.prisma.certificate.count(),
      courseCompletionRate: 80,
      recentCourses: courses
    };
  }

  async getAdminDashboard() {
    return {
      totalUsers: await this.prisma.user.count(),
      totalJobs: await this.prisma.job.count(),
      totalCourses: await this.prisma.course.count(),
      totalApplications: await this.prisma.application.count(),
      revenue: 0
    };
  }
}

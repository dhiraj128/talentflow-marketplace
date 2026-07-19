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
    const candidate = await this.prisma.candidateProfile.findUnique({
      where: { userId },
      include: { skills: true },
    });
    if (!candidate) return this.emptyCandidateDashboard();

    const applications = await this.prisma.application.findMany({
      where: { candidateId: candidate.id },
      include: { job: { include: { employer: true } } },
      orderBy: { appliedAt: 'desc' },
      take: 5,
    });

    const activeApps = await this.prisma.application.count({
      where: { candidateId: candidate.id },
    });

    // Calculate profile completion score accurately
    let profileScore = 0;
    if (candidate.fullName) profileScore += 10;
    if (candidate.title) profileScore += 10;
    if (candidate.location) profileScore += 10;
    if (candidate.avatarUrl) profileScore += 10;
    if (candidate.resumeUrl) profileScore += 10;
    if (candidate.bio) profileScore += 10;
    if (candidate.education) profileScore += 10;
    if (candidate.experience) profileScore += 10;
    if (candidate.githubUrl || candidate.linkedinUrl || candidate.portfolioUrl)
      profileScore += 10;
    if (candidate.skills && candidate.skills.length > 0) profileScore += 10;

    // Get jobs and calculate match scores dynamically
    const allJobs = await this.prisma.job.findMany({
      where: { status: 'PUBLISHED' },
      take: 10,
      include: { employer: true, requiredSkills: true },
    });

    const recommendedJobs = allJobs
      .map((job) => {
        let score = 100;
        if (job.requiredSkills.length > 0) {
          let matched = 0;
          for (const reqSkill of job.requiredSkills) {
            if (candidate.skills.some((cs) => cs.skillId === reqSkill.skillId))
              matched++;
          }
          score = Math.round((matched / job.requiredSkills.length) * 100);
        }
        return { ...job, matchScore: score };
      })
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 4);

    return {
      stats: {
        activeApplications: activeApps,
        savedJobs: 0,
        resumeViews: 0,
        recruiterInvites: 0,
      },
      metrics: {
        jobMatchScore:
          recommendedJobs.length > 0 ? recommendedJobs[0].matchScore : 0,
        profileCompletion: profileScore,
        recentlyViewed: 12,
      },
      recentApplications: applications,
      recommendedJobs,
      recommendedCourses: await this.prisma.course.findMany({ take: 2 }),
      upcomingInterviews: [], // Mapped from applications in interviewing status in the future
      recentActivity: [],
    };
  }

  private emptyCandidateDashboard() {
    return {
      stats: {
        activeApplications: 0,
        savedJobs: 0,
        resumeViews: 0,
        recruiterInvites: 0,
      },
      metrics: { jobMatchScore: 0, profileCompletion: 0, recentlyViewed: 0 },
      recentApplications: [],
      recommendedJobs: [],
      recommendedCourses: [],
      upcomingInterviews: [],
      recentActivity: [],
    };
  }

  async getEmployerDashboard(userId: string) {
    const employer = await this.prisma.employerProfile.findUnique({
      where: { userId },
    });
    if (!employer) return this.emptyEmployerDashboard();

    const jobs = await this.prisma.job.findMany({
      where: { employerId: employer.id },
    });
    const jobIds = jobs.map((j) => j.id);

    const activeJobsCount = jobs.filter((j) => j.status === 'PUBLISHED').length;
    const draftJobsCount = jobs.filter((j) => j.status === 'DRAFT').length;
    const closedJobsCount = jobs.filter((j) => j.status === 'CLOSED').length;
    const totalApplications = await this.prisma.application.count({
      where: { jobId: { in: jobIds } },
    });
    const shortlistedCount = await this.prisma.application.count({
      where: { jobId: { in: jobIds }, status: 'REVIEWING' },
    });
    const interviewedCount = await this.prisma.application.count({
      where: { jobId: { in: jobIds }, status: 'INTERVIEWING' },
    });
    const hiredCount = await this.prisma.application.count({
      where: { jobId: { in: jobIds }, status: 'OFFERED' },
    });

    const allCandidates = await this.prisma.candidateProfile.findMany({
      take: 20,
      include: { user: true, skills: true },
    });
    const activeJobs = jobs.filter((j) => j.status === 'PUBLISHED');

    // Fetch skills for active jobs
    const activeJobsWithSkills = await this.prisma.job.findMany({
      where: { id: { in: activeJobs.map((j) => j.id) } },
      include: { requiredSkills: true },
    });

    const recommendedCandidates = allCandidates
      .map((candidate) => {
        let bestMatch = 0;
        let matchedJobId = null;

        for (const job of activeJobsWithSkills) {
          if (job.requiredSkills.length > 0) {
            let matched = 0;
            for (const reqSkill of job.requiredSkills) {
              if (
                candidate.skills.some((cs) => cs.skillId === reqSkill.skillId)
              )
                matched++;
            }
            const score = Math.round(
              (matched / job.requiredSkills.length) * 100,
            );
            if (score > bestMatch) {
              bestMatch = score;
              matchedJobId = job.id;
            }
          }
        }
        return { ...candidate, matchScore: bestMatch, matchedJobId };
      })
      .filter((c) => c.matchScore > 0)
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 5);

    return {
      stats: {
        totalJobs: jobs.length,
        activeJobs: activeJobsCount,
        draftJobs: draftJobsCount,
        closedJobs: closedJobsCount,
        totalApplications,
        shortlisted: shortlistedCount,
        interviewsScheduled: interviewedCount,
        hiredCandidates: hiredCount,
      },
      recentJobs: await this.prisma.job.findMany({
        where: { employerId: employer.id },
        orderBy: { createdAt: 'desc' },
        take: 5,
      }),
      recentApplications: await this.prisma.application.findMany({
        where: { jobId: { in: jobIds } },
        include: { candidate: true, job: true },
        orderBy: { appliedAt: 'desc' },
        take: 5,
      }),
      recommendedCandidates,
    };
  }

  private emptyEmployerDashboard() {
    return {
      stats: {
        totalJobs: 0,
        activeJobs: 0,
        draftJobs: 0,
        closedJobs: 0,
        totalApplications: 0,
        shortlisted: 0,
        interviewsScheduled: 0,
        hiredCandidates: 0,
      },
      recentJobs: [],
      recentApplications: [],
      recommendedCandidates: [],
    };
  }

  async getFreelancerDashboard(userId: string) {
    // Same as candidate for now
    return this.getCandidateDashboard(userId);
  }

  async getTrainerDashboard(userId: string) {
    const trainer = await this.prisma.trainerProfile.findUnique({
      where: { userId },
    });
    if (!trainer) {
      return {
        publishedCourses: 0,
        draftCourses: 0,
        totalStudents: 0,
        revenue: 0,
        courseRating: 0,
        certificatesIssued: 0,
        courseCompletionRate: 0,
        recentCourses: [],
      };
    }

    const courses = await this.prisma.course.findMany({
      where: { trainerId: trainer.id },
      orderBy: { createdAt: 'desc' },
      take: 3,
    });

    const courseIds = await this.prisma.course
      .findMany({
        where: { trainerId: trainer.id },
        select: { id: true },
      })
      .then((res) => res.map((c) => c.id));

    const totalStudents = await this.prisma.enrollment.count({
      where: { courseId: { in: courseIds } },
    });

    const certificatesIssued = await this.prisma.certificate.count({
      where: { courseId: { in: courseIds } },
    });

    const draftCourses = await this.prisma.course.count({
      where: { trainerId: trainer.id, status: 'DRAFT' },
    });

    const publishedCourses = await this.prisma.course.count({
      where: { trainerId: trainer.id, status: 'PUBLISHED' },
    });

    return {
      publishedCourses,
      draftCourses,
      totalStudents,
      revenue: 0,
      courseRating: 4.5,
      certificatesIssued,
      courseCompletionRate: 80,
      recentCourses: courses,
    };
  }

  async getAdminDashboard() {
    const totalUsers = await this.prisma.user.count();
    const activeEmployers = await this.prisma.employerProfile.count();
    const activeFreelancers = await this.prisma.freelancerProfile.count();
    const activeTrainers = await this.prisma.trainerProfile.count();
    const activeJobSeekers = await this.prisma.candidateProfile.count();
    const jobsPosted = await this.prisma.job.count();
    const courses = await this.prisma.course.count();
    const activeCoupons = await this.prisma.coupon.count({
      where: { isActive: true },
    });
    const expiringSubscriptions = await this.prisma.subscription.count({
      where: {
        endDate: {
          lte: new Date(new Date().setDate(new Date().getDate() + 30)),
        },
        status: 'ACTIVE',
      },
    });
    const premiumMembers = await this.prisma.subscription.count({
      where: { status: 'ACTIVE' },
    });

    // Mock historical data since we don't have historical snapshot tables
    const userGrowthData = [
      { name: 'Jan', users: Math.floor(totalUsers * 0.5) },
      { name: 'Feb', users: Math.floor(totalUsers * 0.6) },
      { name: 'Mar', users: Math.floor(totalUsers * 0.7) },
      { name: 'Apr', users: Math.floor(totalUsers * 0.8) },
      { name: 'May', users: Math.floor(totalUsers * 0.9) },
      { name: 'Jun', users: totalUsers },
    ];

    const revenueData = [
      { name: 'Jan', revenue: 15000 },
      { name: 'Feb', revenue: 18000 },
      { name: 'Mar', revenue: 22000 },
      { name: 'Apr', revenue: 26000 },
      { name: 'May', revenue: 31000 },
      { name: 'Jun', revenue: 38500 },
    ];

    return {
      stats: {
        totalUsers,
        activeJobSeekers,
        activeEmployers,
        activeFreelancers,
        activeTrainers,
        jobsPosted,
        courses,
        premiumMembers,
        monthlyRevenue: 38500, // Derived from mock revenueData for current month
        activeCoupons,
        expiringSubscriptions,
      },
      charts: {
        userGrowthData,
        revenueData,
      },
    };
  }
}

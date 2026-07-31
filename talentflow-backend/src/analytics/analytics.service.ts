import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  async getPlatformStats() {
    const totalJobs = await this.prisma.job.count({
      where: { status: 'PUBLISHED' },
    });
    const totalEmployers = await this.prisma.employerProfile.count();
    const totalFreelancers = await this.prisma.freelancerProfile.count();
    const totalCourses = await this.prisma.course.count();
    const totalCandidates = await this.prisma.candidateProfile.count();

    return {
      totalJobs,
      totalEmployers,
      totalFreelancers,
      totalCourses,
      totalCandidates,
    };
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

    // Determine missing profile items
    const missingProfileItems = [];
    if (!candidate.fullName) missingProfileItems.push({ label: "Full Name", actionHref: "/job-seeker/profile" });
    if (!candidate.title) missingProfileItems.push({ label: "Professional Title", actionHref: "/job-seeker/profile" });
    if (!candidate.location) missingProfileItems.push({ label: "Location", actionHref: "/job-seeker/profile" });
    if (!candidate.avatarUrl) missingProfileItems.push({ label: "Profile Photo", actionHref: "/job-seeker/profile" });
    if (!candidate.resumeUrl) missingProfileItems.push({ label: "Upload Resume", actionHref: "/job-seeker/resume-center/my-resume" });
    if (!candidate.bio) missingProfileItems.push({ label: "About Me (Bio)", actionHref: "/job-seeker/profile" });
    if (!candidate.education) missingProfileItems.push({ label: "Education", actionHref: "/job-seeker/profile" });
    if (!candidate.experience) missingProfileItems.push({ label: "Experience", actionHref: "/job-seeker/profile" });
    if (!candidate.githubUrl && !candidate.linkedinUrl && !candidate.portfolioUrl) {
      missingProfileItems.push({ label: "Social Links", actionHref: "/job-seeker/profile" });
    }
    if (!candidate.skills || candidate.skills.length === 0) missingProfileItems.push({ label: "Skills", actionHref: "/job-seeker/profile" });

    const savedJobsCount = await this.prisma.savedJob.count({
      where: { candidateId: candidate.id },
    });

    const recruiterInvitesCount = await this.prisma.candidateInvitation.count({
      where: { candidateId: candidate.id },
    });

    const shortlistedAppsCount = await this.prisma.application.count({
      where: { candidateId: candidate.id, status: { in: ['SHORTLISTED', 'REVIEWING'] } },
    });

    const interviewingAppsCount = await this.prisma.application.count({
      where: { candidateId: candidate.id, status: 'INTERVIEWING' },
    });

    const offersAppsCount = await this.prisma.application.count({
      where: { candidateId: candidate.id, status: { in: ['OFFERED', 'HIRED'] } },
    });

    return {
      stats: {
        applied: activeApps,
        activeApplications: activeApps,
        shortlisted: shortlistedAppsCount,
        interviews: interviewingAppsCount,
        offers: offersAppsCount,
        savedJobs: savedJobsCount,
        resumeViews: 0,
        profileViews: 0,
        aiMatchScore: recommendedJobs.length > 0 ? recommendedJobs[0].matchScore : 0,
        recruiterInvites: recruiterInvitesCount,
      },
      metrics: {
        jobMatchScore:
          recommendedJobs.length > 0 ? recommendedJobs[0].matchScore : 0,
        profileCompletion: profileScore,
        recentlyViewed: 0,
        missingProfileItems,
      },
      recentApplications: applications,
      recommendedJobs,
      recommendedCourses: await this.prisma.course.findMany({ take: 2 }),
      upcomingInterviews: [],
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
    const freelancer = await this.prisma.freelancerProfile.findUnique({
      where: { userId },
    });

    if (!freelancer) {
      return this.emptyFreelancerDashboard();
    }

    const projects = await this.prisma.projectRequest.findMany({
      where: { freelancerId: freelancer.id },
      include: { employer: { include: { user: true } } },
      orderBy: { updatedAt: 'desc' },
    });

    const reviews = await this.prisma.review.findMany({
      where: { freelancerId: freelancer.id },
      orderBy: { createdAt: 'desc' },
    });

    const activeProjects = projects.filter(p => p.status === 'ACCEPTED').length;
    const completedProjects = projects.filter(p => p.status === 'COMPLETED').length;
    const pendingBids = projects.filter(p => p.status === 'PENDING').length;
    
    const earnings = projects
      .filter(p => p.status === 'COMPLETED')
      .reduce((sum, p) => sum + (p.budget || 0), 0);

    const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
    const avgRating = reviews.length > 0 ? (totalRating / reviews.length).toFixed(1) : 0;

    let profileCompletion = 0;
    if (freelancer.fullName) profileCompletion += 20;
    if (freelancer.title) profileCompletion += 20;
    if (freelancer.bio) profileCompletion += 20;
    if (freelancer.hourlyRate) profileCompletion += 20;
    if (freelancer.avatarUrl) profileCompletion += 20;

    return {
      stats: {
        activeProjects,
        completedProjects,
        pendingBids,
        earnings,
        rating: avgRating,
        profileCompletion,
        totalReviews: reviews.length,
      },
      projects: projects.slice(0, 5),
      invitations: projects.filter(p => p.status === 'PENDING').slice(0, 5),
      reviews: reviews.slice(0, 5),
      recentActivity: []
    };
  }

  private emptyFreelancerDashboard() {
    return {
      stats: {
        activeProjects: 0,
        completedProjects: 0,
        pendingBids: 0,
        earnings: 0,
        rating: 0,
        profileCompletion: 0,
        totalReviews: 0,
      },
      projects: [],
      invitations: [],
      reviews: [],
      recentActivity: [],
    };
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

    const totalEnrollments = await this.prisma.enrollment.count({
      where: { courseId: { in: courseIds } },
    });
    const completedEnrollments = await this.prisma.enrollment.count({
      where: { courseId: { in: courseIds }, completedAt: { not: null } },
    });
    const courseCompletionRate = totalEnrollments > 0 ? Math.round((completedEnrollments / totalEnrollments) * 100) : 0;

    const courseReviews = await this.prisma.review.findMany({
      where: { courseId: { in: courseIds } },
    });
    const courseRating = courseReviews.length > 0
      ? Number((courseReviews.reduce((sum, r) => sum + r.rating, 0) / courseReviews.length).toFixed(1))
      : 0;

    return {
      publishedCourses,
      draftCourses,
      totalStudents,
      revenue: 0,
      courseRating,
      certificatesIssued,
      courseCompletionRate,
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
    const pendingJobs = await this.prisma.job.count({ where: { status: 'DRAFT', deletedAt: null } });
    const publishedJobs = await this.prisma.job.count({ where: { status: 'PUBLISHED', deletedAt: null } });
    const closedJobs = await this.prisma.job.count({ where: { status: 'CLOSED', deletedAt: null } });
    const courses = await this.prisma.course.count();
    const pendingCourses = await this.prisma.course.count({ where: { status: 'DRAFT' } });
    const totalApplications = await this.prisma.application.count();
    const activeCoupons = await this.prisma.coupon.count({
      where: { isActive: true },
    }).catch(() => 0);
    const expiringSubscriptions = await this.prisma.subscription.count({
      where: {
        endDate: {
          lte: new Date(new Date().setDate(new Date().getDate() + 30)),
        },
        status: 'ACTIVE',
      },
    }).catch(() => 0);
    const premiumMembers = await this.prisma.subscription.count({
      where: { status: 'ACTIVE' },
    }).catch(() => 0);

    const recentUsers = await this.prisma.user.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: { id: true, email: true, role: true, createdAt: true, status: true },
    });

    const recentJobs = await this.prisma.job.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { employer: { select: { companyName: true } } },
    });

    return {
      stats: {
        totalUsers,
        activeJobSeekers,
        activeEmployers,
        activeFreelancers,
        activeTrainers,
        jobsPosted,
        activeJobs: publishedJobs,
        pendingJobs,
        publishedJobs,
        closedJobs,
        courses,
        pendingCourses,
        totalApplications,
        premiumMembers,
        monthlyRevenue: 0,
        activeCoupons,
        expiringSubscriptions,
        totalRevenue: 0,
      },
      recentUsers,
      recentJobs,
      charts: {
        userGrowthData: [],
        revenueData: [],
      },
    };
  }
}

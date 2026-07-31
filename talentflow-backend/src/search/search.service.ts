import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SearchService {
  constructor(private prisma: PrismaService) {}

  /**
   * Search Talent / Candidates backed strictly by real database records.
   */
  async searchTalent(q?: string, location?: string) {
    const where: any = {
      profileDiscoverable: true,
    };

    if (q) {
      where.OR = [
        { fullName: { contains: q, mode: 'insensitive' } },
        { title: { contains: q, mode: 'insensitive' } },
        { bio: { contains: q, mode: 'insensitive' } },
      ];
    }

    if (location) {
      where.location = { contains: location, mode: 'insensitive' };
    }

    const profiles = await this.prisma.candidateProfile.findMany({
      where,
      include: {
        user: { select: { id: true, email: true } },
        skills: { include: { skill: true } },
      },
      take: 20,
      orderBy: { createdAt: 'desc' },
    });

    const results = await Promise.all(
      profiles.map(async (p) => {
        // Compute real V1.6 aggregate rating
        const reviews = await this.prisma.review.aggregate({
          where: { subjectUserId: p.userId, status: 'PUBLISHED' },
          _avg: { rating: true },
          _count: { rating: true },
        });

        const avgRating = reviews._avg.rating || 0;
        const totalReviews = reviews._count.rating || 0;

        return {
          id: p.id,
          userId: p.userId,
          name: p.fullName,
          role: p.title || 'Candidate',
          location: p.location || 'Remote',
          bio: p.bio || null,
          avatarUrl: p.avatarUrl || null,
          rating: Number(avgRating.toFixed(1)),
          totalReviews,
          skills: p.skills.map((s) => s.skill.name),
          createdAt: p.createdAt,
        };
      }),
    );

    return results;
  }

  /**
   * Search Published Jobs.
   */
  async searchJobs(q?: string, location?: string) {
    const where: any = {
      deletedAt: null,
      status: 'PUBLISHED',
    };

    if (q) {
      where.OR = [
        { title: { contains: q, mode: 'insensitive' } },
        { description: { contains: q, mode: 'insensitive' } },
        { employer: { companyName: { contains: q, mode: 'insensitive' } } },
      ];
    }

    if (location) {
      where.location = { contains: location, mode: 'insensitive' };
    }

    const jobs = await this.prisma.job.findMany({
      where,
      include: {
        employer: { select: { companyName: true, logoUrl: true, location: true } },
        requiredSkills: { include: { skill: true } },
      },
      take: 20,
      orderBy: { createdAt: 'desc' },
    });

    return jobs.map((j) => ({
      id: j.id,
      title: j.title,
      company: j.employer?.companyName || 'Company',
      location: j.location || 'Remote',
      salary: j.salaryRange || 'Competitive',
      type: j.type || 'Full-time',
      posted: j.createdAt.toISOString(),
      skills: j.requiredSkills.map((s) => s.skill.name),
      logo: j.employer?.logoUrl || null,
    }));
  }

  /**
   * Search Freelancers backed strictly by real database records.
   */
  async searchFreelancers(q?: string, location?: string, minRate?: number, maxRate?: number, minRating?: number) {
    const where: any = {};

    if (q) {
      where.OR = [
        { fullName: { contains: q, mode: 'insensitive' } },
        { title: { contains: q, mode: 'insensitive' } },
        { bio: { contains: q, mode: 'insensitive' } },
      ];
    }

    if (location) {
      where.location = { contains: location, mode: 'insensitive' };
    }

    if (minRate !== undefined || maxRate !== undefined) {
      where.hourlyRate = {};
      if (minRate !== undefined && !isNaN(minRate)) where.hourlyRate.gte = minRate;
      if (maxRate !== undefined && !isNaN(maxRate)) where.hourlyRate.lte = maxRate;
    }

    const profiles = await this.prisma.freelancerProfile.findMany({
      where,
      include: {
        user: { select: { id: true, email: true } },
        skills: { include: { skill: true } },
      },
      take: 20,
      orderBy: { createdAt: 'desc' },
    });

    const results = await Promise.all(
      profiles.map(async (fp) => {
        // Calculate real completed contracts count
        const completedJobs = await this.prisma.projectRequest.count({
          where: { freelancerId: fp.id, status: 'COMPLETED' },
        });

        // Compute real V1.6 aggregate rating
        const reviews = await this.prisma.review.aggregate({
          where: { subjectUserId: fp.userId, status: 'PUBLISHED' },
          _avg: { rating: true },
          _count: { rating: true },
        });

        const avgRating = reviews._avg.rating || 0;
        const totalReviews = reviews._count.rating || 0;

        return {
          id: fp.id,
          userId: fp.userId,
          name: fp.fullName,
          title: fp.title || 'Freelancer',
          bio: fp.bio || null,
          avatarUrl: fp.avatarUrl || null,
          location: fp.location || 'Remote',
          hourlyRate: fp.hourlyRate || 0,
          rating: Number(avgRating.toFixed(1)),
          totalReviews,
          completedJobs,
          skills: fp.skills.map((s) => s.skill.name),
        };
      }),
    );

    if (minRating !== undefined && !isNaN(minRating) && minRating > 0) {
      return results.filter((r) => r.rating >= minRating);
    }

    return results;
  }

  /**
   * Search Courses with V1.6 real review ratings.
   */
  async searchCourses(q?: string, category?: string) {
    const where: any = { status: 'PUBLISHED' };

    if (q) {
      where.OR = [
        { title: { contains: q, mode: 'insensitive' } },
        { description: { contains: q, mode: 'insensitive' } },
      ];
    }

    if (category) {
      where.category = { contains: category, mode: 'insensitive' };
    }

    const courses = await this.prisma.course.findMany({
      where,
      include: {
        trainer: { select: { fullName: true } },
      },
      take: 20,
      orderBy: { createdAt: 'desc' },
    });

    return Promise.all(
      courses.map(async (c) => {
        const reviews = await this.prisma.review.aggregate({
          where: { courseId: c.id, status: 'PUBLISHED' },
          _avg: { rating: true },
          _count: { rating: true },
        });

        return {
          id: c.id,
          title: c.title,
          instructor: c.trainer?.fullName || 'Instructor',
          rating: Number((reviews._avg.rating || c.rating || 0).toFixed(1)),
          totalReviews: reviews._count.rating || 0,
          students: c.studentCount || 0,
          price: c.price || 0,
          level: c.level || 'All Levels',
          thumbnail: c.thumbnailUrl || null,
        };
      }),
    );
  }

  /**
   * Unified Search across Jobs, Talent, Freelancers, and Courses.
   */
  async searchUnified(q?: string) {
    const [jobs, talent, freelancers, courses] = await Promise.all([
      this.searchJobs(q),
      this.searchTalent(q),
      this.searchFreelancers(q),
      this.searchCourses(q),
    ]);

    return {
      query: q || '',
      totalResults: jobs.length + talent.length + freelancers.length + courses.length,
      jobs,
      talent,
      freelancers,
      courses,
    };
  }

  /**
   * Job Auto-Suggestions for keyword inputs.
   */
  async getJobSuggestions(q: string) {
    if (!q || q.length < 2) return { suggestions: [] };

    const jobs = await this.prisma.job.findMany({
      where: {
        status: 'PUBLISHED',
        title: { contains: q, mode: 'insensitive' },
      },
      distinct: ['title'],
      select: { title: true },
      take: 4,
    });

    const skills = await this.prisma.skill.findMany({
      where: { name: { contains: q, mode: 'insensitive' } },
      select: { name: true },
      take: 3,
    });

    const companies = await this.prisma.employerProfile.findMany({
      where: { companyName: { contains: q, mode: 'insensitive' } },
      select: { companyName: true },
      take: 2,
    });

    const suggestions = [
      ...jobs.map((j) => ({ text: j.title, type: 'job_title' })),
      ...skills.map((s) => ({ text: s.name, type: 'skill' })),
      ...companies.map((c) => ({ text: c.companyName, type: 'company' })),
    ].slice(0, 8);

    return { suggestions };
  }

  /**
   * Record Search History for authenticated user.
   */
  async recordSearchHistory(userId: string, queryJson: any, searchType: any = 'JOB') {
    if (!userId || !queryJson) return null;
    return this.prisma.searchHistory.create({
      data: {
        userId,
        searchType,
        queryJson,
      },
    }).catch(() => null);
  }

  /**
   * Get Search History for authenticated user.
   */
  async getSearchHistory(userId: string) {
    if (!userId) return [];
    return this.prisma.searchHistory.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 10,
    });
  }

  /**
   * Job Location Suggestions.
   */
  async getJobLocations(q: string) {
    if (!q) {
      return {
        locations: ['Remote', 'Bangalore', 'Mumbai', 'Pune', 'Delhi NCR'],
      };
    }

    const jobs = await this.prisma.job.findMany({
      where: {
        status: 'PUBLISHED',
        location: { contains: q, mode: 'insensitive' },
        NOT: { location: null },
      },
      distinct: ['location'],
      select: { location: true },
      take: 6,
    });

    const locations = jobs.map((j) => j.location).filter(Boolean) as string[];

    if (
      'remote'.includes(q.toLowerCase()) &&
      !locations.some((l) => l.toLowerCase() === 'remote')
    ) {
      locations.push('Remote');
    }

    return { locations: locations.slice(0, 6) };
  }
}

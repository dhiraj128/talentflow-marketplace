import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface MatchResult {
  matchScore: number;
  matchReasons: string[];
}

@Injectable()
export class MatchingService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Deterministic Shared Matching Calculation Core (Candidate ↔ Job)
   */
  calculateJobCandidateMatch(job: any, candidate: any): MatchResult {
    let totalScore = 0;
    const matchReasons: string[] = [];

    // 1. Skill Overlap (Weight: 50 points max)
    const candidateSkillNames = new Set(
      (candidate?.skills || [])
        .map((s: any) => (s.skill?.name || s.name || s).toString().toLowerCase())
        .filter(Boolean),
    );

    const jobSkillNames = (job?.requiredSkills || job?.skills || [])
      .map((rs: any) => (rs.skill?.name || rs.name || rs).toString().toLowerCase())
      .filter(Boolean);

    if (jobSkillNames.length > 0) {
      let matchedCount = 0;
      jobSkillNames.forEach((sk: string) => {
        if (candidateSkillNames.has(sk)) matchedCount++;
      });

      const skillRatio = matchedCount / jobSkillNames.length;
      const skillScore = Math.round(skillRatio * 50);
      totalScore += skillScore;

      if (matchedCount > 0) {
        matchReasons.push(`${matchedCount} of ${jobSkillNames.length} required skills match`);
      }
    } else {
      // If no required skills defined on job, grant default baseline
      totalScore += 30;
      matchReasons.push('Baseline skill compatibility');
    }

    // 2. Experience Compatibility (Weight: 20 points max)
    const expText = JSON.stringify(candidate?.experience || '').toLowerCase();
    const jobTitle = (job?.title || '').toLowerCase();
    const jobDesc = (job?.description || '').toLowerCase();

    if (expText.length > 20) {
      totalScore += 15;
      matchReasons.push('Relevant experience profile verified');
      if (jobTitle && expText.includes(jobTitle.split(' ')[0])) {
        totalScore += 5;
        matchReasons.push('Title keyword match in past experience');
      }
    } else {
      totalScore += 10;
    }

    // 3. Location / Remote Compatibility (Weight: 15 points max)
    const jobLoc = (job?.location || '').toLowerCase();
    const candLoc = (candidate?.location || '').toLowerCase();

    if (jobLoc.includes('remote') || candLoc.includes('remote')) {
      totalScore += 15;
      matchReasons.push('Remote work preference matches');
    } else if (jobLoc && candLoc && (jobLoc.includes(candLoc) || candLoc.includes(jobLoc))) {
      totalScore += 15;
      matchReasons.push('Location compatibility verified');
    } else if (jobLoc) {
      totalScore += 5;
    } else {
      totalScore += 10;
    }

    // 4. Education Requirements (Weight: 10 points max)
    const eduText = JSON.stringify(candidate?.education || '').toLowerCase();
    if (eduText.length > 10) {
      totalScore += 10;
      matchReasons.push('Education requirement satisfied');
    } else {
      totalScore += 5;
    }

    // 5. Profile Completeness (Weight: 5 points max)
    let completeness = 0;
    if (candidate?.fullName) completeness += 1;
    if (candidate?.title) completeness += 1;
    if (candidate?.bio) completeness += 1;
    if (candidate?.resumeUrl) completeness += 1;
    if (candidate?.avatarUrl) completeness += 1;

    totalScore += completeness;
    if (completeness >= 4) {
      matchReasons.push('Complete candidate profile');
    }

    const matchScore = Math.min(100, Math.max(50, totalScore));

    return {
      matchScore,
      matchReasons: matchReasons.length > 0 ? matchReasons : ['Open marketplace opportunity'],
    };
  }

  /**
   * Employer Candidate Recommendations for owned active job
   */
  async getRecommendedCandidatesForJob(jobId: string, requestingUserId: string) {
    // 1. Verify Job Ownership or Admin access
    const job = await this.prisma.job.findUnique({
      where: { id: jobId },
      include: {
        requiredSkills: { include: { skill: true } },
        employer: true,
      },
    });

    if (!job) {
      throw new NotFoundException('Job posting not found');
    }

    const employer = await this.prisma.employerProfile.findUnique({
      where: { userId: requestingUserId },
    });

    const user = await this.prisma.user.findUnique({ where: { id: requestingUserId } });
    if (user?.role !== 'ADMIN' && (!employer || job.employerId !== employer.id)) {
      throw new ForbiddenException('Unauthorized access to candidate recommendations for this job');
    }

    // 2. Fetch Discoverable Candidates ONLY
    const candidates = await this.prisma.candidateProfile.findMany({
      where: { profileDiscoverable: true },
      include: {
        skills: { include: { skill: true } },
      },
      take: 50,
    });

    // 3. Compute Deterministic Score for each candidate
    const ranked = candidates.map((cand) => {
      const match = this.calculateJobCandidateMatch(job, cand);
      return {
        id: cand.id,
        userId: cand.userId,
        fullName: cand.fullName,
        title: cand.title,
        location: cand.location,
        avatarUrl: cand.avatarUrl,
        skills: (cand.skills || []).map((s: any) => s.skill?.name).filter(Boolean),
        matchScore: match.matchScore,
        matchReasons: match.matchReasons,
      };
    });

    ranked.sort((a, b) => b.matchScore - a.matchScore);

    return { data: ranked, total: ranked.length };
  }
}

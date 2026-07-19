import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MatchingEngineService {
  constructor(private prisma: PrismaService) {}

  async calculateMatch(candidateId: string, jobId: string) {
    const candidateSkills = await this.prisma.candidateSkill.findMany({
      where: { candidateId },
      include: { skill: true },
    });
    const jobSkills = await this.prisma.jobSkill.findMany({
      where: { jobId },
      include: { skill: true },
    });

    if (jobSkills.length === 0) return { score: 100 };

    let matched = 0;
    for (const reqSkill of jobSkills) {
      if (candidateSkills.some((cs) => cs.skillId === reqSkill.skillId)) {
        matched++;
      }
    }

    const score = Math.round((matched / jobSkills.length) * 100);
    return { candidateId, jobId, score };
  }

  async getRecommendedJobs(candidateId: string) {
    const jobs = await this.prisma.job.findMany({
      where: { status: 'PUBLISHED' },
      include: { employer: true, requiredSkills: { include: { skill: true } } },
    });

    const recommendations = await Promise.all(
      jobs.map(async (job) => {
        const { score } = await this.calculateMatch(candidateId, job.id);
        return { ...job, matchScore: score };
      }),
    );

    return recommendations.sort((a, b) => b.matchScore - a.matchScore);
  }

  async getRecommendedCandidates(jobId: string) {
    const candidates = await this.prisma.candidateProfile.findMany({
      include: { user: true, skills: { include: { skill: true } } },
    });

    const recommendations = await Promise.all(
      candidates.map(async (candidate) => {
        const { score } = await this.calculateMatch(candidate.id, jobId);
        return { ...candidate, matchScore: score };
      }),
    );

    return recommendations.sort((a, b) => b.matchScore - a.matchScore);
  }
}

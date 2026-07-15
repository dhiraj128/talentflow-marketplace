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
      if (candidateSkills.some(cs => cs.skillId === reqSkill.skillId)) {
        matched++;
      }
    }

    const score = Math.round((matched / jobSkills.length) * 100);
    return { candidateId, jobId, score };
  }
}

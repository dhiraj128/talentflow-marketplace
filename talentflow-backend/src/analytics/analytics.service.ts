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

    return {
      totalJobs,
      totalApplications,
      totalCandidates,
      totalEmployers,
    };
  }
}

import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { MatchingEngineService } from './matching-engine.service';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { Role } from "@prisma/client";
import { Roles } from "../common/decorators/roles.decorator";
import { RolesGuard } from "../common/guards/roles.guard";

@ApiTags('matching-engine')
@ApiBearerAuth()
@Controller('matching-engine')
export class MatchingEngineController {
  constructor(private readonly matchingEngineService: MatchingEngineService) {}

  @Get(':candidateId/:jobId')
    @UseGuards(JwtAuthGuard)
  calculateMatch(
    @Param('candidateId') candidateId: string,
    @Param('jobId') jobId: string,
  ) {
    return this.matchingEngineService.calculateMatch(candidateId, jobId);
  }

  @Get('jobs/:candidateId')
    @UseGuards(JwtAuthGuard)
  getRecommendedJobs(@Param('candidateId') candidateId: string) {
    return this.matchingEngineService.getRecommendedJobs(candidateId);
  }

  @Get('candidates/:jobId')
    @UseGuards(JwtAuthGuard)
  getRecommendedCandidates(@Param('jobId') jobId: string) {
    return this.matchingEngineService.getRecommendedCandidates(jobId);
  }
}

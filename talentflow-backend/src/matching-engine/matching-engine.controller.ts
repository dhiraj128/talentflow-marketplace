import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { MatchingEngineService } from './matching-engine.service';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@ApiTags('matching-engine')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('matching-engine')
export class MatchingEngineController {
  constructor(private readonly matchingEngineService: MatchingEngineService) {}

  @Get(':candidateId/:jobId')
  calculateMatch(
    @Param('candidateId') candidateId: string,
    @Param('jobId') jobId: string,
  ) {
    return this.matchingEngineService.calculateMatch(candidateId, jobId);
  }

  @Get('jobs/:candidateId')
  getRecommendedJobs(@Param('candidateId') candidateId: string) {
    return this.matchingEngineService.getRecommendedJobs(candidateId);
  }

  @Get('candidates/:jobId')
  getRecommendedCandidates(@Param('jobId') jobId: string) {
    return this.matchingEngineService.getRecommendedCandidates(jobId);
  }
}

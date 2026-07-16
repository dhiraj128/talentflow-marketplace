import { Controller, Get, Query } from '@nestjs/common';
import { SearchService } from './search.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('search')
@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get('talent')
  searchTalent(@Query('q') q: string, @Query('location') location: string) {
    return this.searchService.searchTalent(q, location);
  }

  @Get('jobs')
  searchJobs(@Query('q') q: string, @Query('location') location: string) {
    return this.searchService.searchJobs(q, location);
  }

  @Get('freelancers')
  searchFreelancers(@Query('q') q: string, @Query('location') location: string) {
    return this.searchService.searchFreelancers(q, location);
  }

  @Get('courses')
  searchCourses(@Query('q') q: string, @Query('location') location: string) {
    return this.searchService.searchCourses(q, location);
  }
}

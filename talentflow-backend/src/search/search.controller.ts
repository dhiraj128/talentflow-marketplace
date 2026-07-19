import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { SearchService } from './search.service';
import { ApiTags } from '@nestjs/swagger';
import { Role } from "@prisma/client";
import { Roles } from "../common/decorators/roles.decorator";
import { RolesGuard } from "../common/guards/roles.guard";
import { JwtAuthGuard } from "../common/guards/jwt-auth.guard";

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
  searchFreelancers(
    @Query('q') q: string,
    @Query('location') location: string,
  ) {
    return this.searchService.searchFreelancers(q, location);
  }

  @Get('courses')
  searchCourses(@Query('q') q: string, @Query('location') location: string) {
    return this.searchService.searchCourses(q, location);
  }

  @Get('suggestions')
  getJobSuggestions(@Query('q') q: string) {
    return this.searchService.getJobSuggestions(q);
  }

  @Get('locations')
  getJobLocations(@Query('q') q: string) {
    return this.searchService.getJobLocations(q);
  }
}

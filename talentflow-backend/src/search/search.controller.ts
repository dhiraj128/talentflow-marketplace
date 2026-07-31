import { Controller, Get, Post, Body, Query, UseGuards } from '@nestjs/common';
import { SearchService } from './search.service';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('search')
@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get('unified')
  searchUnified(@Query('q') q?: string) {
    return this.searchService.searchUnified(q);
  }

  @Get('talent')
  searchTalent(@Query('q') q?: string, @Query('location') location?: string) {
    return this.searchService.searchTalent(q, location);
  }

  @Get('jobs')
  searchJobs(@Query('q') q?: string, @Query('location') location?: string) {
    return this.searchService.searchJobs(q, location);
  }

  @Get('freelancers')
  searchFreelancers(
    @Query('q') q?: string,
    @Query('location') location?: string,
    @Query('minRate') minRate?: string,
    @Query('maxRate') maxRate?: string,
    @Query('minRating') minRating?: string,
  ) {
    const parsedMinRate = minRate ? parseFloat(minRate) : undefined;
    const parsedMaxRate = maxRate ? parseFloat(maxRate) : undefined;
    const parsedMinRating = minRating ? parseFloat(minRating) : undefined;

    return this.searchService.searchFreelancers(
      q,
      location,
      parsedMinRate,
      parsedMaxRate,
      parsedMinRating,
    );
  }

  @Get('courses')
  searchCourses(@Query('q') q?: string, @Query('category') category?: string) {
    return this.searchService.searchCourses(q, category);
  }

  @Get('history')
  @UseGuards(JwtAuthGuard)
  getSearchHistory(@CurrentUser() user: any) {
    const userId = user.sub || user.userId;
    return this.searchService.getSearchHistory(userId);
  }

  @Post('history')
  @UseGuards(JwtAuthGuard)
  recordSearchHistory(@CurrentUser() user: any, @Body() body: { queryJson: any; searchType?: any }) {
    const userId = user.sub || user.userId;
    return this.searchService.recordSearchHistory(userId, body.queryJson, body.searchType);
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

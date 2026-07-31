import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { SavedSearchesService } from './saved-searches.service';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('saved-searches')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('saved-searches')
export class SavedSearchesController {
  constructor(private readonly savedSearchesService: SavedSearchesService) {}

  @Post()
  create(
    @CurrentUser() user: any,
    @Body() body: { name: string; searchType?: any; queryJson: any },
  ) {
    const userId = user.sub || user.userId;
    return this.savedSearchesService.create(userId, body);
  }

  @Get()
  findAllForUser(@CurrentUser() user: any) {
    const userId = user.sub || user.userId;
    return this.savedSearchesService.findAllForUser(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() user: any) {
    const userId = user.sub || user.userId;
    return this.savedSearchesService.findOne(id, userId);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() user: any) {
    const userId = user.sub || user.userId;
    return this.savedSearchesService.remove(id, userId);
  }
}

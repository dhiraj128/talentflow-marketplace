import { UpdateMeDto } from './dto/update-me.dto';
import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, Req } from '@nestjs/common';
import { FreelancersService } from './freelancers.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@Controller('freelancers')
export class FreelancersController {
  constructor(private readonly freelancersService: FreelancersService) {}

  @Get()
  findAll(@Query() query: any) {
    return this.freelancersService.findAll(query);
  }

  @Get('admin/all')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  findAllAdmin() {
    return this.freelancersService.findAllAdmin();
  }

  @Get('me')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('FREELANCER')
  getMe(@Req() req: any) {
    // We can reuse updateMe logic or create getMe in service
    return this.freelancersService.getMe(req.user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.freelancersService.findOne(id);
  }

  @Patch('me')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('FREELANCER')
  updateMe(@Req() req: any, @Body() updateData: UpdateMeDto) {
    return this.freelancersService.updateMe(req.user.id, updateData);
  }

  @Patch(':id/verify')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  verify(@Param('id') id: string, @Body('isVerified') isVerified: boolean) {
    return this.freelancersService.verify(id, isVerified);
  }
}

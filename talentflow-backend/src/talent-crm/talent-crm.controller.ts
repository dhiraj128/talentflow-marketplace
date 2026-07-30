import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { TalentCrmService } from './talent-crm.service';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Role } from '@prisma/client';

@ApiTags('talent-crm')
@Controller('talent-crm')
export class TalentCrmController {
  constructor(private readonly crmService: TalentCrmService) {}

  // Discovery & Search
  @Get('search')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.EMPLOYER, Role.ADMIN)
  searchTalent(@CurrentUser() user: any, @Query() query: any) {
    return this.crmService.searchTalent(user, query);
  }

  // Saved Candidates
  @ApiBearerAuth()
  @Post('saved/:candidateId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.EMPLOYER, Role.ADMIN)
  saveCandidate(
    @Param('candidateId') candidateId: string,
    @Body('isFavorite') isFavorite: boolean,
    @CurrentUser() user: any,
  ) {
    return this.crmService.saveCandidate(candidateId, isFavorite, user);
  }

  @ApiBearerAuth()
  @Delete('saved/:candidateId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.EMPLOYER, Role.ADMIN)
  unsaveCandidate(@Param('candidateId') candidateId: string, @CurrentUser() user: any) {
    return this.crmService.unsaveCandidate(candidateId, user);
  }

  @ApiBearerAuth()
  @Get('saved')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.EMPLOYER, Role.ADMIN)
  getSavedCandidates(@CurrentUser() user: any, @Query() query: any) {
    return this.crmService.getSavedCandidates(user, query);
  }

  // Talent Pools
  @ApiBearerAuth()
  @Post('pools')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.EMPLOYER, Role.ADMIN)
  createPool(
    @Body('name') name: string,
    @Body('description') description: string,
    @CurrentUser() user: any,
  ) {
    return this.crmService.createPool(name, description, user);
  }

  @ApiBearerAuth()
  @Get('pools')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.EMPLOYER, Role.ADMIN)
  getPools(@CurrentUser() user: any) {
    return this.crmService.getPools(user);
  }

  @ApiBearerAuth()
  @Get('pools/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.EMPLOYER, Role.ADMIN)
  getPool(@Param('id') id: string, @CurrentUser() user: any) {
    return this.crmService.getPool(id, user);
  }

  @ApiBearerAuth()
  @Patch('pools/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.EMPLOYER, Role.ADMIN)
  updatePool(
    @Param('id') id: string,
    @Body('name') name: string,
    @Body('description') description: string,
    @CurrentUser() user: any,
  ) {
    return this.crmService.updatePool(id, name, description, user);
  }

  @ApiBearerAuth()
  @Delete('pools/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.EMPLOYER, Role.ADMIN)
  deletePool(@Param('id') id: string, @CurrentUser() user: any) {
    return this.crmService.deletePool(id, user);
  }

  @ApiBearerAuth()
  @Post('pools/:id/members/:candidateId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.EMPLOYER, Role.ADMIN)
  addMemberToPool(
    @Param('id') poolId: string,
    @Param('candidateId') candidateId: string,
    @CurrentUser() user: any,
  ) {
    return this.crmService.addMemberToPool(poolId, candidateId, user);
  }

  @ApiBearerAuth()
  @Delete('pools/:id/members/:candidateId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.EMPLOYER, Role.ADMIN)
  removeMemberFromPool(
    @Param('id') poolId: string,
    @Param('candidateId') candidateId: string,
    @CurrentUser() user: any,
  ) {
    return this.crmService.removeMemberFromPool(poolId, candidateId, user);
  }

  // Invitations Workflow
  @ApiBearerAuth()
  @Post('invitations')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.EMPLOYER, Role.ADMIN)
  createInvitation(
    @Body('candidateId') candidateId: string,
    @Body('jobId') jobId: string,
    @Body('message') message: string,
    @CurrentUser() user: any,
  ) {
    return this.crmService.createInvitation(candidateId, jobId, message, user);
  }

  @ApiBearerAuth()
  @Get('invitations/employer')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.EMPLOYER, Role.ADMIN)
  getEmployerInvitations(@CurrentUser() user: any) {
    return this.crmService.getEmployerInvitations(user);
  }

  @ApiBearerAuth()
  @Get('invitations/candidate')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.CANDIDATE, Role.ADMIN)
  getCandidateInvitations(@CurrentUser() user: any) {
    return this.crmService.getCandidateInvitations(user);
  }

  @ApiBearerAuth()
  @Patch('invitations/:id/decline')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.CANDIDATE, Role.ADMIN)
  declineInvitation(@Param('id') id: string, @CurrentUser() user: any) {
    return this.crmService.declineInvitation(id, user);
  }

  @ApiBearerAuth()
  @Patch('invitations/:id/cancel')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.EMPLOYER, Role.ADMIN)
  cancelInvitation(@Param('id') id: string, @CurrentUser() user: any) {
    return this.crmService.cancelInvitation(id, user);
  }

  @ApiBearerAuth()
  @Post('invitations/:id/accept-and-apply')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.CANDIDATE, Role.ADMIN)
  acceptInvitationAndApply(@Param('id') id: string, @CurrentUser() user: any) {
    return this.crmService.acceptInvitationAndApply(id, user);
  }

  // Analytics
  @ApiBearerAuth()
  @Get('analytics')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.EMPLOYER, Role.ADMIN)
  getAnalytics(@CurrentUser() user: any) {
    return this.crmService.getAnalytics(user);
  }

  @ApiBearerAuth()
  @Get('admin/analytics')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  getAdminAnalytics() {
    return this.crmService.getAdminAnalytics();
  }
}

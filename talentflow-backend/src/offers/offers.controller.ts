import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { OffersService } from './offers.service';
import { CreateOfferDto } from './dto/create-offer.dto';
import { UpdateOfferDto } from './dto/update-offer.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('offers')
export class OffersController {
  constructor(private readonly offersService: OffersService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.EMPLOYER, Role.ADMIN)
  create(@Body() dto: CreateOfferDto, @Req() req: any) {
    return this.offersService.create(dto, req.user.id);
  }

  @Get('employer')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.EMPLOYER, Role.ADMIN)
  findAllByEmployer(@Req() req: any) {
    return this.offersService.findAllByEmployer(req.user.id);
  }

  @Get('candidate')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.CANDIDATE, Role.ADMIN)
  findAllByCandidate(@Req() req: any) {
    return this.offersService.findAllByCandidate(req.user.id);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.EMPLOYER, Role.CANDIDATE, Role.ADMIN)
  findOne(@Param('id') id: string, @Req() req: any) {
    return this.offersService.findOne(id, req.user.id, req.user.role);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.EMPLOYER, Role.ADMIN)
  update(
    @Param('id') id: string,
    @Body() dto: UpdateOfferDto,
    @Req() req: any,
  ) {
    return this.offersService.update(id, dto, req.user.id);
  }

  @Post(':id/send')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.EMPLOYER, Role.ADMIN)
  sendOffer(@Param('id') id: string, @Req() req: any) {
    return this.offersService.sendOffer(id, req.user.id);
  }

  @Post(':id/accept')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.CANDIDATE, Role.ADMIN)
  acceptOffer(@Param('id') id: string, @Req() req: any) {
    return this.offersService.acceptOffer(id, req.user.id);
  }

  @Post(':id/decline')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.CANDIDATE, Role.ADMIN)
  declineOffer(
    @Param('id') id: string,
    @Body() body: { reason?: string },
    @Req() req: any,
  ) {
    return this.offersService.declineOffer(id, body?.reason, req.user.id);
  }

  @Post(':id/withdraw')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.EMPLOYER, Role.ADMIN)
  withdrawOffer(@Param('id') id: string, @Req() req: any) {
    return this.offersService.withdrawOffer(id, req.user.id);
  }
}

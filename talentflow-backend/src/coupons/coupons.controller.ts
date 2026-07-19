import { CreateCouponsDto } from './dto/create.dto';
import { UpdateCouponsDto } from './dto/update.dto';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { CouponsService } from './coupons.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from "@prisma/client";

@Controller('coupons')
export class CouponsController {
  constructor(private readonly couponsService: CouponsService) {}

  
  
  @Post()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
  create(@Body() createDto: CreateCouponsDto) {
    return this.couponsService.create(createDto);
  }

  @Get()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
  findAll() {
    return this.couponsService.findAll();
  }

  @Get(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
  findOne(@Param('id') id: string) {
    return this.couponsService.findOne(id);
  }

  
  
  @Patch(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
  update(@Param('id') id: string, @Body() updateDto: UpdateCouponsDto) {
    return this.couponsService.update(id, updateDto);
  }

  
  
  @Delete(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
  remove(@Param('id') id: string) {
    return this.couponsService.remove(id);
  }
}

import { CreateOffersDto } from './dto/create.dto';
import { UpdateOffersDto } from './dto/update.dto';
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
import { OffersService } from './offers.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from "@prisma/client";

@Controller('offers')
export class OffersController {
  constructor(private readonly offersService: OffersService) {}

  
  
  @Post()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
  create(@Body() createDto: CreateOffersDto) {
    return this.offersService.create(createDto);
  }

  @Get()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
  findAll() {
    return this.offersService.findAll();
  }

  @Get(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
  findOne(@Param('id') id: string) {
    return this.offersService.findOne(id);
  }

  
  
  @Patch(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
  update(@Param('id') id: string, @Body() updateDto: UpdateOffersDto) {
    return this.offersService.update(id, updateDto);
  }

  
  
  @Delete(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
  remove(@Param('id') id: string) {
    return this.offersService.remove(id);
  }
}

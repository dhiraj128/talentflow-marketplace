import { CreateTrainersDto } from './dto/create.dto';
import { UpdateTrainersDto } from './dto/update.dto';
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
import { TrainersService } from './trainers.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from "@prisma/client";

@Controller('trainers')
export class TrainersController {
  constructor(private readonly trainersService: TrainersService) {}

  @Get()
  findAll() {
    return this.trainersService.findAll();
  }

  @Get(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.TRAINER, Role.ADMIN)
  findOne(@Param('id') id: string) {
    return this.trainersService.findOne(id);
  }

  
  
  @Patch(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.TRAINER, Role.ADMIN)
  update(@Param('id') id: string, @Body() updateDto: UpdateTrainersDto) {
    return this.trainersService.update(id, updateDto);
  }

  
  
  @Delete(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
  remove(@Param('id') id: string) {
    return this.trainersService.remove(id);
  }
}

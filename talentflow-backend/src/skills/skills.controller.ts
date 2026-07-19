import { CreateSkillsDto } from './dto/create.dto';
import { UpdateSkillsDto } from './dto/update.dto';
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
import { SkillsService } from './skills.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from "@prisma/client";

@Controller('skills')
export class SkillsController {
  constructor(private readonly skillsService: SkillsService) {}

  
  
  @Post()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
  create(@Body() createDto: CreateSkillsDto) {
    return this.skillsService.create(createDto);
  }

  @Get()
  findAll() {
    return this.skillsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.skillsService.findOne(id);
  }

  
  
  @Patch(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
  update(@Param('id') id: string, @Body() updateDto: UpdateSkillsDto) {
    return this.skillsService.update(id, updateDto);
  }

  
  
  @Delete(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
  remove(@Param('id') id: string) {
    return this.skillsService.remove(id);
  }
}

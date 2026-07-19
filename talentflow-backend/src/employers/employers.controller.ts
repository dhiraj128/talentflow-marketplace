import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { EmployersService } from './employers.service';
import {
  CreateEmployerDto,
  UpdateEmployerDto,
} from './dto/create-employer.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Role } from "@prisma/client";
import { Roles } from "../common/decorators/roles.decorator";
import { RolesGuard } from "../common/guards/roles.guard";
import { CurrentUser } from "../common/decorators/current-user.decorator";

@ApiTags('Employers')
@ApiBearerAuth()
@Controller('employers')
export class EmployersController {
  constructor(private readonly employersService: EmployersService) {}

  @Post()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
  create(@Body() createEmployerDto: CreateEmployerDto) {
    return this.employersService.create(createEmployerDto);
  }

  @Get()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
  findAll(@Query('skip') skip?: string, @Query('take') take?: string) {
    return this.employersService.findAll(skip ? +skip : 0, take ? +take : 10);
  }

  @Get(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.EMPLOYER, Role.ADMIN)
  findOne(@Param('id') id: string, @CurrentUser() user: any) {
      return this.employersService.findOne(id, user);
    }

  @Patch(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.EMPLOYER, Role.ADMIN)
  update(
    @Param('id') id: string,
    @Body() updateEmployerDto: UpdateEmployerDto, @CurrentUser() user: any
  ) {
      return this.employersService.update(id, updateEmployerDto, user);
    }

  @Delete(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
  remove(@Param('id') id: string, @CurrentUser() user: any) {
      return this.employersService.remove(id, user);
    }
}

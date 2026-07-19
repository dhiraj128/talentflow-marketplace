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
import { CandidatesService } from './candidates.service';
import {
  CreateCandidateDto,
  UpdateCandidateDto,
} from './dto/create-candidate.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Role } from "@prisma/client";
import { Roles } from "../common/decorators/roles.decorator";
import { RolesGuard } from "../common/guards/roles.guard";

@ApiTags('Candidates')
@ApiBearerAuth()
@Controller('candidates')
export class CandidatesController {
  constructor(private readonly candidatesService: CandidatesService) {}

  @Post()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
  create(@Body() createCandidateDto: CreateCandidateDto) {
    return this.candidatesService.create(createCandidateDto);
  }

  @Get()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
  findAll(@Query('skip') skip?: string, @Query('take') take?: string) {
    return this.candidatesService.findAll(skip ? +skip : 0, take ? +take : 10);
  }

  @Get(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.CANDIDATE, Role.ADMIN)
  findOne(@Param('id') id: string) {
    return this.candidatesService.findOne(id);
  }

  @Patch(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.CANDIDATE, Role.ADMIN)
  update(
    @Param('id') id: string,
    @Body() updateCandidateDto: UpdateCandidateDto,
  ) {
    return this.candidatesService.update(id, updateCandidateDto);
  }

  @Delete(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
  remove(@Param('id') id: string) {
    return this.candidatesService.remove(id);
  }
}

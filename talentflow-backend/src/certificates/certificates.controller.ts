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
import { CertificatesService } from './certificates.service';
import { CreateCertificateDto } from './dto/create-certificate.dto';
import { UpdateCertificateDto } from './dto/update-certificate.dto';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { Role } from "@prisma/client";
import { Roles } from "../common/decorators/roles.decorator";
import { RolesGuard } from "../common/guards/roles.guard";
import { CurrentUser } from "../common/decorators/current-user.decorator";

@ApiTags('certificates')
@ApiBearerAuth()
@Controller('certificates')
export class CertificatesController {
  constructor(private readonly certificatesService: CertificatesService) {}

  @Post()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.TRAINER, Role.ADMIN)
  create(@Body() createCertificateDto: CreateCertificateDto) {
    return this.certificatesService.create(createCertificateDto);
  }

  @Get()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.CANDIDATE, Role.TRAINER, Role.ADMIN)
  findAll(@Query('skip') skip?: string, @Query('take') take?: string) {
    return this.certificatesService.findAll(
      skip ? +skip : undefined,
      take ? +take : undefined,
    );
  }

  @Get(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.CANDIDATE, Role.TRAINER, Role.ADMIN)
  findOne(@Param('id') id: string, @CurrentUser() user: any) {
      return this.certificatesService.findOne(id, user);
    }

  @Patch(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.TRAINER, Role.ADMIN)
  update(
    @Param('id') id: string,
    @Body() updateCertificateDto: UpdateCertificateDto, @CurrentUser() user: any
  ) {
      return this.certificatesService.update(id, updateCertificateDto, user);
    }

  @Delete(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.TRAINER, Role.ADMIN)
  remove(@Param('id') id: string, @CurrentUser() user: any) {
      return this.certificatesService.remove(id, user);
    }
}

const fs = require('fs');
const path = require('path');

const models = ['Category', 'Designation', 'Location', 'Skill'];
const lowerPlural = ['categories', 'designations', 'locations', 'skills'];
const classPlural = ['Categories', 'Designations', 'Locations', 'Skills'];

const srcDir = path.join(__dirname, 'src');

models.forEach((Model, i) => {
  const pl = lowerPlural[i];
  const ClassPlural = classPlural[i];
  const modelLower = Model.toLowerCase();
  
  const controllerCode = `import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ${ClassPlural}Service } from './${pl}.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@Controller('${pl}')
export class ${ClassPlural}Controller {
  constructor(private readonly ${pl}Service: ${ClassPlural}Service) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Post()
  create(@Body() createDto: any) {
    return this.${pl}Service.create(createDto);
  }

  @Get()
  findAll() {
    return this.${pl}Service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.${pl}Service.findOne(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDto: any) {
    return this.${pl}Service.update(id, updateDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.${pl}Service.remove(id);
  }
}
`;

  const serviceCode = `import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ${ClassPlural}Service {
  constructor(private readonly prisma: PrismaService) {}

  create(data: any) {
    return this.prisma.${modelLower}.create({ data });
  }

  findAll() {
    return this.prisma.${modelLower}.findMany({ orderBy: { name: 'asc' } });
  }

  async findOne(id: string) {
    const item = await this.prisma.${modelLower}.findUnique({ where: { id } });
    if (!item) throw new NotFoundException('${Model} not found');
    return item;
  }

  async update(id: string, data: any) {
    try {
      return await this.prisma.${modelLower}.update({ where: { id }, data });
    } catch {
      throw new NotFoundException('${Model} not found');
    }
  }

  async remove(id: string) {
    try {
      await this.prisma.${modelLower}.delete({ where: { id } });
      return { success: true };
    } catch {
      throw new NotFoundException('${Model} not found');
    }
  }
}
`;

  const controllerPath = path.join(srcDir, pl, pl + '.controller.ts');
  const servicePath = path.join(srcDir, pl, pl + '.service.ts');
  
  fs.writeFileSync(controllerPath, controllerCode);
  fs.writeFileSync(servicePath, serviceCode);
});

console.log('Successfully generated controllers and services.');

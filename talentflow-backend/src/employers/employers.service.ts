import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateEmployerDto,
  UpdateEmployerDto,
} from './dto/create-employer.dto';

@Injectable()
export class EmployersService {
  constructor(private readonly prisma: PrismaService) {}

  create(createEmployerDto: CreateEmployerDto) {
    return this.prisma.employerProfile.create({ data: createEmployerDto });
  }

  findAll(skip: number = 0, take: number = 10) {
    return this.prisma.employerProfile.findMany({ skip, take });
  }

  async findOne(id: string, user?: any) {
    const employer = await this.prisma.employerProfile.findUnique({
      where: { id },
    });
    if (!employer) throw new NotFoundException('Employer not found');
    if (user && user.role !== 'ADMIN' && employer.userId !== (user.sub || user.userId)) {
      throw new ForbiddenException('Forbidden');
    }
    return employer;
  }

  async update(id: string, updateEmployerDto: UpdateEmployerDto, user?: any) {
    const employer = await this.prisma.employerProfile.findUnique({ where: { id } });
    if (!employer) throw new NotFoundException('Employer not found');
    if (user && user.role !== 'ADMIN' && employer.userId !== (user.sub || user.userId)) {
      throw new ForbiddenException('Forbidden');
    }
    return this.prisma.employerProfile.update({
      where: { id },
      data: updateEmployerDto,
    });
  }

  async remove(id: string, user?: any) {
    const employer = await this.prisma.employerProfile.findUnique({ where: { id } });
    if (!employer) throw new NotFoundException('Employer not found');
    if (user && user.role !== 'ADMIN' && employer.userId !== (user.sub || user.userId)) {
      throw new ForbiddenException('Forbidden');
    }
    await this.prisma.employerProfile.delete({ where: { id } });
    return { success: true };
  }
}

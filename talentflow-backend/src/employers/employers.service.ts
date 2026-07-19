import { Injectable, NotFoundException } from '@nestjs/common';
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

  async findOne(id: string) {
    const employer = await this.prisma.employerProfile.findUnique({
      where: { id },
    });
    if (!employer) throw new NotFoundException('Employer not found');
    return employer;
  }

  async update(id: string, updateEmployerDto: UpdateEmployerDto) {
    try {
      return await this.prisma.employerProfile.update({
        where: { id },
        data: updateEmployerDto,
      });
    } catch {
      throw new NotFoundException('Employer not found');
    }
  }

  async remove(id: string) {
    try {
      await this.prisma.employerProfile.delete({ where: { id } });
      return { success: true };
    } catch {
      throw new NotFoundException('Employer not found');
    }
  }
}

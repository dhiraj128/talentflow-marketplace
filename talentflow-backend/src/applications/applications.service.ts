import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationDto } from './dto/update-application.dto';

@Injectable()
export class ApplicationsService {
  constructor(private prisma: PrismaService) {}

  create(createApplicationDto: CreateApplicationDto) {
    return this.prisma.application.create({ data: createApplicationDto });
  }

  findAll(skip?: number, take?: number) {
    return this.prisma.application.findMany({ skip, take });
  }

  findOne(id: string) {
    return this.prisma.application.findUnique({ where: { id } });
  }

  update(id: string, updateApplicationDto: UpdateApplicationDto) {
    return this.prisma.application.update({ where: { id }, data: updateApplicationDto });
  }

  remove(id: string) {
    return this.prisma.application.delete({ where: { id } });
  }
}

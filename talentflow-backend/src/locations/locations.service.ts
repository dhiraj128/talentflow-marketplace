import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class LocationsService {
  constructor(private readonly prisma: PrismaService) {}

  create(data: any) {
    return this.prisma.location.create({ data });
  }

  async findAll(filters: any = {}) {
    const page = Number(filters.page) || 1;
    const limit = Number(filters.limit) || 20;
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.location.findMany({ skip, take: limit, orderBy: { name: 'asc' } }),
      this.prisma.location.count()
    ]);
    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }
  findOne(id: string) {
    return this.prisma.location.findUnique({ where: { id } });
  }

  update(id: string, data: any) {
    return this.prisma.location.update({ where: { id }, data });
  }

  remove(id: string) {
    return this.prisma.location.delete({ where: { id } });
  }
}


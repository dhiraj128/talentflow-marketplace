import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PlansService {
  constructor(private readonly prisma: PrismaService) {}

  create(data: any) {
    return this.prisma.plan.create({ data });
  }

  async findAll(filters: any = {}) {
    const page = Number(filters.page) || 1;
    const limit = Number(filters.limit) || 20;
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.plan.findMany({ skip, take: limit }),
      this.prisma.plan.count()
    ]);
    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findOne(id: string) {
    const item = await this.prisma.plan.findUnique({ where: { id } });
    if (!item) throw new NotFoundException('Plan not found');
    return item;
  }

  async update(id: string, data: any) {
    try {
      return await this.prisma.plan.update({ where: { id }, data });
    } catch {
      throw new NotFoundException('Plan not found');
    }
  }

  async remove(id: string) {
    try {
      await this.prisma.plan.delete({ where: { id } });
      return { success: true };
    } catch {
      throw new NotFoundException('Plan not found');
    }
  }
}

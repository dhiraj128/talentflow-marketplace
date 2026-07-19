import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CouponsService {
  constructor(private readonly prisma: PrismaService) {}

  create(data: any) {
    return this.prisma.coupon.create({ data });
  }

  async findAll(filters: any = {}) {
    const page = Number(filters.page) || 1;
    const limit = Number(filters.limit) || 20;
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.coupon.findMany({ skip, take: limit }),
      this.prisma.coupon.count(),
    ]);
    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findOne(id: string) {
    const item = await this.prisma.coupon.findUnique({ where: { id } });
    if (!item) throw new NotFoundException('Coupon not found');
    return item;
  }

  async update(id: string, data: any) {
    try {
      return await this.prisma.coupon.update({ where: { id }, data });
    } catch {
      throw new NotFoundException('Coupon not found');
    }
  }

  async remove(id: string) {
    try {
      await this.prisma.coupon.delete({ where: { id } });
      return { success: true };
    } catch {
      throw new NotFoundException('Coupon not found');
    }
  }
}

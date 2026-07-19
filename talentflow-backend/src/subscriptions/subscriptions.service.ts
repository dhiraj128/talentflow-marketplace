import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SubscriptionsService {
  constructor(private readonly prisma: PrismaService) {}

  create(data: any) {
    return this.prisma.subscription.create({ data });
  }

  async findAll(filters: any = {}) {
    const page = Number(filters.page) || 1;
    const limit = Number(filters.limit) || 20;
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.subscription.findMany({ skip, take: limit }),
      this.prisma.subscription.count(),
    ]);
    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findOne(id: string) {
    const item = await this.prisma.subscription.findUnique({ where: { id } });
    if (!item) throw new NotFoundException('Subscription not found');
    return item;
  }

  async update(id: string, data: any) {
    try {
      return await this.prisma.subscription.update({ where: { id }, data });
    } catch {
      throw new NotFoundException('Subscription not found');
    }
  }

  async remove(id: string) {
    try {
      await this.prisma.subscription.delete({ where: { id } });
      return { success: true };
    } catch {
      throw new NotFoundException('Subscription not found');
    }
  }
}

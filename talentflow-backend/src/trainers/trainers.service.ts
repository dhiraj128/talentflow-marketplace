import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TrainersService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.trainerProfile.findMany();
  }

  async findOne(id: string) {
    const item = await this.prisma.trainerProfile.findUnique({ where: { id } });
    if (!item) throw new NotFoundException('TrainerProfile not found');
    return item;
  }

  async update(id: string, data: any) {
    try {
      return await this.prisma.trainerProfile.update({ where: { id }, data });
    } catch {
      throw new NotFoundException('TrainerProfile not found');
    }
  }

  async remove(id: string) {
    try {
      await this.prisma.trainerProfile.delete({ where: { id } });
      return { success: true };
    } catch {
      throw new NotFoundException('TrainerProfile not found');
    }
  }
}

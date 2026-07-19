import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TrainersService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.trainerProfile.findMany();
  }

  async findOne(id: string, user?: any) {
    const trainer = await this.prisma.trainerProfile.findUnique({ where: { id } });
    if (!trainer) throw new NotFoundException('Trainer not found');
    if (user && user.role !== 'ADMIN' && trainer.userId !== (user.sub || user.userId)) throw new ForbiddenException('Forbidden');
    return trainer;
  }

  async update(id: string, updateDto: any, user?: any) {
    const trainer = await this.prisma.trainerProfile.findUnique({ where: { id } });
    if (!trainer) throw new NotFoundException('Trainer not found');
    if (user && user.role !== 'ADMIN' && trainer.userId !== (user.sub || user.userId)) throw new ForbiddenException('Forbidden');
    return this.prisma.trainerProfile.update({ where: { id }, data: updateDto });
  }

  async remove(id: string, user?: any) {
    const trainer = await this.prisma.trainerProfile.findUnique({ where: { id } });
    if (!trainer) throw new NotFoundException('Trainer not found');
    if (user && user.role !== 'ADMIN' && trainer.userId !== (user.sub || user.userId)) throw new ForbiddenException('Forbidden');
    await this.prisma.trainerProfile.delete({ where: { id } });
    return { success: true };
  }
}

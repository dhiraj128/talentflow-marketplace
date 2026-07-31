import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SavedSearchesService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, data: { name: string; searchType?: any; queryJson: any }) {
    return this.prisma.savedSearch.create({
      data: {
        userId,
        name: data.name,
        searchType: data.searchType || 'JOB',
        queryJson: data.queryJson || {},
      },
    });
  }

  async findAllForUser(userId: string) {
    return this.prisma.savedSearch.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string, userId: string) {
    const saved = await this.prisma.savedSearch.findUnique({ where: { id } });
    if (!saved) {
      throw new NotFoundException('Saved search not found');
    }
    if (saved.userId !== userId) {
      throw new ForbiddenException('Unauthorized access to saved search');
    }
    return saved;
  }

  async remove(id: string, userId: string) {
    await this.findOne(id, userId);
    return this.prisma.savedSearch.delete({ where: { id } });
  }
}

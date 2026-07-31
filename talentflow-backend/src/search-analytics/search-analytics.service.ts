import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SearchAnalyticsService {
  constructor(private prisma: PrismaService) {}

  /**
   * Log search event safely (Privacy conscious)
   */
  async recordSearchEvent(data: {
    userId?: string;
    searchType?: any;
    query: string;
    resultCount: number;
  }) {
    if (!data.query || data.query.trim().length === 0) return null;

    const normalizedQuery = data.query.trim().toLowerCase();

    // 1. Record search event for aggregated analytics
    await this.prisma.searchEvent.create({
      data: {
        userId: data.userId || null,
        searchType: data.searchType || 'JOB',
        normalizedQuery,
        resultCount: data.resultCount,
      },
    });

    // 2. If user is authenticated, save to user SearchHistory
    if (data.userId) {
      await this.prisma.searchHistory.create({
        data: {
          userId: data.userId,
          searchType: data.searchType || 'JOB',
          queryJson: { query: normalizedQuery },
        },
      });
    }
  }

  /**
   * Fetch authenticated user search history
   */
  async getUserSearchHistory(userId: string) {
    return this.prisma.searchHistory.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 10,
    });
  }

  /**
   * Clear user search history
   */
  async clearUserSearchHistory(userId: string) {
    return this.prisma.searchHistory.deleteMany({
      where: { userId },
    });
  }

  /**
   * Admin-only Search Analytics Insights
   */
  async getAdminSearchAnalytics(requestingUser: any) {
    if (requestingUser?.role !== 'ADMIN') {
      throw new ForbiddenException('Admin authorization required');
    }

    const [totalSearches, zeroResultCount, savedSearchCount, jobAlertCount] = await Promise.all([
      this.prisma.searchEvent.count(),
      this.prisma.searchEvent.count({ where: { resultCount: 0 } }),
      this.prisma.savedSearch.count(),
      this.prisma.jobAlert.count({ where: { isActive: true } }),
    ]);

    const recentEvents = await this.prisma.searchEvent.findMany({
      take: 20,
      orderBy: { createdAt: 'desc' },
    });

    return {
      totalSearches,
      zeroResultCount,
      savedSearchCount,
      jobAlertCount,
      recentSearchEvents: recentEvents.map((e) => ({
        id: e.id,
        searchType: e.searchType,
        query: e.normalizedQuery,
        resultCount: e.resultCount,
        timestamp: e.createdAt,
      })),
    };
  }
}

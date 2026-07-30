import { Injectable, Logger, ServiceUnavailableException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface HealthResponse {
  status: 'ok' | 'degraded';
  service: string;
  timestamp: string;
  version: string;
  commit: string;
  uptime: number;
  dependencies: {
    database: 'healthy' | 'unhealthy';
    email: 'healthy' | 'degraded';
    storage: 'healthy' | 'degraded';
  };
}

export interface ReadinessResponse {
  status: 'ready' | 'not_ready';
  database: {
    status: 'healthy' | 'unhealthy';
    responseTimeMs?: number;
    error?: string;
  };
  capabilities: {
    email: 'healthy' | 'degraded';
    storage: 'healthy' | 'degraded';
  };
  timestamp: string;
}

@Injectable()
export class HealthService {
  private readonly logger = new Logger(HealthService.name);

  constructor(private readonly prisma: PrismaService) {}

  private checkEmailCapability(): 'healthy' | 'degraded' {
    const key = process.env.RESEND_API_KEY;
    if (key && key.startsWith('re_') && key.length > 10) {
      return 'healthy';
    }
    return 'degraded';
  }

  private checkStorageCapability(): 'healthy' | 'degraded' {
    const bucket = process.env.AWS_S3_BUCKET;
    const region = process.env.AWS_REGION;
    if (bucket || region) {
      return 'healthy';
    }
    return 'degraded';
  }

  async getHealthStatus(): Promise<HealthResponse> {
    let dbStatus: 'healthy' | 'unhealthy' = 'healthy';
    try {
      await this.prisma.$queryRaw`SELECT 1`;
    } catch {
      dbStatus = 'unhealthy';
    }

    const emailStatus = this.checkEmailCapability();
    const storageStatus = this.checkStorageCapability();

    const overallStatus = dbStatus === 'healthy' ? 'ok' : 'degraded';

    return {
      status: overallStatus,
      service: 'talentflow-backend',
      timestamp: new Date().toISOString(),
      version: '1.0.2',
      commit: process.env.RENDER_GIT_COMMIT || '9ef159d',
      uptime: Math.round(process.uptime() * 100) / 100,
      dependencies: {
        database: dbStatus,
        email: emailStatus,
        storage: storageStatus,
      },
    };
  }

  async getReadinessStatus(): Promise<ReadinessResponse> {
    const emailStatus = this.checkEmailCapability();
    const storageStatus = this.checkStorageCapability();

    try {
      const startTime = process.hrtime.bigint();
      await this.prisma.$queryRaw`SELECT 1`;
      const endTime = process.hrtime.bigint();
      const responseTimeMs = Number(endTime - startTime) / 1000000;

      return {
        status: 'ready',
        database: {
          status: 'healthy',
          responseTimeMs: Number(responseTimeMs.toFixed(2)),
        },
        capabilities: {
          email: emailStatus,
          storage: storageStatus,
        },
        timestamp: new Date().toISOString(),
      };
    } catch (error: any) {
      this.logger.error(`[READINESS FAILED] Database SELECT 1 error: ${error.message}`);

      throw new ServiceUnavailableException({
        status: 'not_ready',
        statusCode: 503,
        error: 'Service Unavailable',
        message: 'Critical dependency unavailable: PostgreSQL database is not reachable',
        database: {
          status: 'unhealthy',
          error: 'Database connection failed',
        },
        capabilities: {
          email: emailStatus,
          storage: storageStatus,
        },
        timestamp: new Date().toISOString(),
      });
    }
  }
}

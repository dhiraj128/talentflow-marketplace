import { Test, TestingModule } from '@nestjs/testing';
import { HealthService } from './health.service';
import { HealthController } from './health.controller';
import { PrismaService } from '../prisma/prisma.service';
import { ServiceUnavailableException } from '@nestjs/common';
import { redactSensitiveData } from '../common/utils/redact.util';

describe('Production Observability & Health Monitoring Spec', () => {
  let healthService: HealthService;
  let healthController: HealthController;

  const mockPrismaService = {
    $queryRaw: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [
        HealthService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    healthService = module.get<HealthService>(HealthService);
    healthController = module.get<HealthController>(HealthController);
  });

  describe('1. Health Endpoint (GET /health)', () => {
    it('returns safe metadata with uptime, commit, and dependency statuses', async () => {
      mockPrismaService.$queryRaw.mockResolvedValue([{ '?column?': 1 }]);

      const res = await healthController.getHealth();

      expect(res.status).toBe('ok');
      expect(res.service).toBe('talentflow-backend');
      expect(res.version).toBe('1.0.2');
      expect(res.uptime).toBeGreaterThanOrEqual(0);
      expect(res.dependencies.database).toBe('healthy');
      expect(res).not.toHaveProperty('databaseUrl');
      expect(res).not.toHaveProperty('secret');
    });
  });

  describe('2. Readiness Endpoint (GET /health/ready)', () => {
    it('returns 200 OK with responseTimeMs when PostgreSQL is healthy', async () => {
      mockPrismaService.$queryRaw.mockResolvedValue([{ '?column?': 1 }]);

      const res = await healthController.getReadiness();

      expect(res.status).toBe('ready');
      expect(res.database.status).toBe('healthy');
      expect(res.database.responseTimeMs).toBeGreaterThanOrEqual(0);
    });

    it('returns 503 Service Unavailable when PostgreSQL SELECT 1 fails', async () => {
      mockPrismaService.$queryRaw.mockRejectedValue(new Error('Connection terminated unexpectedly'));

      await expect(healthController.getReadiness()).rejects.toThrow(ServiceUnavailableException);
    });
  });

  describe('3. Degraded Dependency Classification', () => {
    it('marks email capability as degraded when RESEND_API_KEY is unconfigured without breaking readiness', async () => {
      const originalKey = process.env.RESEND_API_KEY;
      delete process.env.RESEND_API_KEY;

      mockPrismaService.$queryRaw.mockResolvedValue([{ '?column?': 1 }]);

      const res = await healthController.getReadiness();

      expect(res.status).toBe('ready');
      expect(res.database.status).toBe('healthy');
      expect(res.capabilities.email).toBe('degraded');

      process.env.RESEND_API_KEY = originalKey;
    });
  });

  describe('4. Log Redaction & Security Utility', () => {
    it('redacts sensitive fields (passwords, OTPs, Bearer tokens, DB URLs, API keys)', () => {
      const sensitiveInput = {
        email: 'user@example.com',
        password: 'SuperSecretPassword123!',
        otp: '123456',
        authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        database_url: 'postgresql://postgres:secretpass@localhost:5432/talentflow',
        resend_api_key: 're_123456789',
        nested: {
          refreshToken: 'refresh_token_abc',
        },
      };

      const sanitized = redactSensitiveData(sensitiveInput);

      expect(sanitized.email).toBe('user@example.com');
      expect(sanitized.password).toBe('[REDACTED]');
      expect(sanitized.otp).toBe('[REDACTED]');
      expect(sanitized.authorization).toBe('[REDACTED]');
      expect(sanitized.database_url).toBe('[REDACTED]');
      expect(sanitized.resend_api_key).toBe('[REDACTED]');
      expect(sanitized.nested.refreshToken).toBe('[REDACTED]');
    });
  });
});

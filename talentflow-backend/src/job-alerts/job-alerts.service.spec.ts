import { JobAlertsService } from './job-alerts.service';
import { ForbiddenException, NotFoundException } from '@nestjs/common';

describe('JobAlertsService', () => {
  let service: JobAlertsService;
  let mockPrisma: any;
  let mockNotifications: any;
  let mockEmailProvider: any;

  beforeEach(() => {
    mockPrisma = {
      candidateProfile: { findUnique: jest.fn() },
      jobAlert: { create: jest.fn(), findMany: jest.fn(), findUnique: jest.fn(), update: jest.fn(), delete: jest.fn() },
      job: { findMany: jest.fn() },
      jobAlertDelivery: { findMany: jest.fn(), createMany: jest.fn() },
    };
    mockNotifications = { create: jest.fn() };
    mockEmailProvider = { sendEmail: jest.fn() };

    service = new JobAlertsService(mockPrisma, mockNotifications, mockEmailProvider);
  });

  it('should create job alert for candidate', async () => {
    mockPrisma.candidateProfile.findUnique.mockResolvedValue({ id: 'candidate-1' });
    mockPrisma.jobAlert.create.mockResolvedValue({ id: 'alert-1', candidateId: 'candidate-1', name: 'Frontend Alert' });

    const result = await service.create('user-1', { name: 'Frontend Alert', queryJson: { q: 'frontend' } });
    expect(result.id).toBe('alert-1');
  });

  it('should prevent non-candidates from creating job alerts', async () => {
    mockPrisma.candidateProfile.findUnique.mockResolvedValue(null);

    await expect(service.create('employer-user-1', { name: 'Alert', queryJson: {} })).rejects.toThrow(ForbiddenException);
  });
});

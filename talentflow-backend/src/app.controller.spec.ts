import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { HealthService } from './health/health.service';

describe('AppController', () => {
  let appController: AppController;

  const mockHealthService = {
    getHealthStatus: jest.fn().mockReturnValue({
      status: 'ok',
      service: 'talentflow-backend',
      version: '1.0.2',
    }),
  };

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        { provide: HealthService, useValue: mockHealthService },
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return status ok', () => {
      expect(appController.getRoot()).toEqual({
        status: 'ok',
        service: 'TalentFlow Backend',
        version: '1.0.2',
      });
    });
  });
});

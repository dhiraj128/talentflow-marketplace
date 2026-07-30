import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
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

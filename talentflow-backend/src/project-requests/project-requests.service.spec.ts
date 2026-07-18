import { Test, TestingModule } from '@nestjs/testing';
import { ProjectRequestsService } from './project-requests.service';

describe('ProjectRequestsService', () => {
  let service: ProjectRequestsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProjectRequestsService],
    }).compile();

    service = module.get<ProjectRequestsService>(ProjectRequestsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

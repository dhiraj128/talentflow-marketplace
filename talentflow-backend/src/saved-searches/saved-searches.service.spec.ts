import { SavedSearchesService } from './saved-searches.service';
import { ForbiddenException, NotFoundException } from '@nestjs/common';

describe('SavedSearchesService', () => {
  let service: SavedSearchesService;
  let mockPrisma: any;

  beforeEach(() => {
    mockPrisma = {
      savedSearch: {
        create: jest.fn(),
        findMany: jest.fn(),
        findUnique: jest.fn(),
        delete: jest.fn(),
      },
    };
    service = new SavedSearchesService(mockPrisma);
  });

  it('should create saved search for authenticated user', async () => {
    mockPrisma.savedSearch.create.mockResolvedValue({ id: 'search-1', userId: 'user-1', name: 'React Jobs' });

    const result = await service.create('user-1', { name: 'React Jobs', queryJson: { q: 'react' } });
    expect(result.id).toBe('search-1');
  });

  it('should reject unauthorized access to another user saved search', async () => {
    mockPrisma.savedSearch.findUnique.mockResolvedValue({ id: 'search-1', userId: 'user-A' });

    await expect(service.findOne('search-1', 'user-B')).rejects.toThrow(ForbiddenException);
  });
});

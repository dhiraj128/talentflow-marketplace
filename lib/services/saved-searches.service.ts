import api from '@/lib/api';

export interface SavedSearchItem {
  id: string;
  userId: string;
  name: string;
  searchType: 'JOB' | 'TALENT' | 'FREELANCER' | 'COURSE';
  queryJson: any;
  createdAt: string;
  updatedAt: string;
}

export class SavedSearchesService {
  static async create(payload: { name: string; searchType?: string; queryJson: any }): Promise<SavedSearchItem> {
    const res = await api.post('/saved-searches', payload);
    return res.data;
  }

  static async getAll(): Promise<SavedSearchItem[]> {
    const res = await api.get('/saved-searches');
    return res.data;
  }

  static async getById(id: string): Promise<SavedSearchItem> {
    const res = await api.get(`/saved-searches/${id}`);
    return res.data;
  }

  static async delete(id: string): Promise<{ success: boolean }> {
    const res = await api.delete(`/saved-searches/${id}`);
    return res.data;
  }
}

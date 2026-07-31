import api from '@/lib/api';

export interface JobAlertItem {
  id: string;
  candidateId: string;
  savedSearchId?: string | null;
  name: string;
  queryJson: any;
  frequency: 'DAILY' | 'WEEKLY';
  isActive: boolean;
  lastRunAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export class JobAlertsService {
  static async create(payload: { name: string; queryJson: any; frequency?: 'DAILY' | 'WEEKLY'; savedSearchId?: string }): Promise<JobAlertItem> {
    const res = await api.post('/job-alerts', payload);
    return res.data;
  }

  static async getAll(): Promise<JobAlertItem[]> {
    const res = await api.get('/job-alerts');
    return res.data;
  }

  static async delete(id: string): Promise<{ success: boolean }> {
    const res = await api.delete(`/job-alerts/${id}`);
    return res.data;
  }
}

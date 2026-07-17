import api from '../api';

export const applicationService = {
  getApplications: async (params?: { candidateId?: string; employerId?: string; jobId?: string }) => {
    const query = new URLSearchParams(params as any).toString();
    const response = await api.get(`/applications${query ? `?${query}` : ''}`);
    return response.data;
  },
  getApplication: async (id: string) => {
    const response = await api.get(`/applications/${id}`);
    return response.data;
  },
  getEmployerApplications: async () => {
    const response = await api.get(`/applications/employer/me`);
    return response.data;
  },
  createApplication: async (data: any) => {
    const response = await api.post('/applications', data);
    return response.data;
  },
  updateApplicationStatus: async (id: string, status: string) => {
    const response = await api.patch(`/applications/${id}/status`, { status });
    return response.data;
  },
  deleteApplication: async (id: string) => {
    const response = await api.delete(`/applications/${id}`);
    return response.data;
  }
};

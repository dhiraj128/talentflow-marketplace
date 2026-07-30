import api from '../api';

export const applicationService = {
  getApplications: async (params?: { candidateId?: string; employerId?: string; jobId?: string; status?: string; page?: number; limit?: number }) => {
    const query = new URLSearchParams(params as any).toString();
    const response = await api.get(`/applications${query ? `?${query}` : ''}`);
    return response.data?.data && response.data?.totalPages !== undefined ? response.data.data : response.data;
  },
  getApplication: async (id: string) => {
    const response = await api.get(`/applications/${id}`);
    return response.data?.data && response.data?.totalPages !== undefined ? response.data.data : response.data;
  },
  getEmployerApplications: async () => {
    const response = await api.get(`/applications/employer/me`);
    return response.data?.data && response.data?.totalPages !== undefined ? response.data.data : response.data;
  },
  getPipeline: async (params?: { jobId?: string; status?: string; search?: string; tagId?: string }) => {
    const query = new URLSearchParams(params as any).toString();
    const response = await api.get(`/applications/pipeline${query ? `?${query}` : ''}`);
    return response.data;
  },
  getAnalytics: async () => {
    const response = await api.get(`/applications/analytics`);
    return response.data;
  },
  createApplication: async (data: any) => {
    const response = await api.post('/applications', data);
    return response.data?.data && response.data?.totalPages !== undefined ? response.data.data : response.data;
  },
  updateApplicationStatus: async (id: string, status: string, reason?: string) => {
    const response = await api.patch(`/applications/${id}/status`, { status, reason });
    return response.data?.data && response.data?.totalPages !== undefined ? response.data.data : response.data;
  },
  withdrawApplication: async (id: string, reason?: string) => {
    const response = await api.patch(`/applications/${id}/withdraw`, { reason });
    return response.data?.data && response.data?.totalPages !== undefined ? response.data.data : response.data;
  },
  getStatusHistory: async (id: string) => {
    const response = await api.get(`/applications/${id}/history`);
    return response.data;
  },
  createNote: async (id: string, content: string) => {
    const response = await api.post(`/applications/${id}/notes`, { content });
    return response.data;
  },
  getNotes: async (id: string) => {
    const response = await api.get(`/applications/${id}/notes`);
    return response.data;
  },
  deleteNote: async (noteId: string) => {
    const response = await api.delete(`/applications/notes/${noteId}`);
    return response.data;
  },
  getTags: async () => {
    const response = await api.get(`/applications/tags`);
    return response.data;
  },
  createTag: async (name: string, color?: string) => {
    const response = await api.post(`/applications/tags`, { name, color });
    return response.data;
  },
  assignTag: async (id: string, tagId: string) => {
    const response = await api.post(`/applications/${id}/tags/${tagId}`);
    return response.data;
  },
  removeTag: async (id: string, tagId: string) => {
    const response = await api.delete(`/applications/${id}/tags/${tagId}`);
    return response.data;
  },
  deleteApplication: async (id: string) => {
    const response = await api.delete(`/applications/${id}`);
    return response.data?.data && response.data?.totalPages !== undefined ? response.data.data : response.data;
  }
};

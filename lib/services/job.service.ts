import api from '../api';

export const jobService = {
  getJobs: async () => {
    const response = await api.get('/jobs');
    return response.data;
  },
  getJob: async (id: string) => {
    const response = await api.get(`/jobs/${id}`);
    return response.data;
  },
  createJob: async (data: any) => {
    const response = await api.post('/jobs', data);
    return response.data;
  },
  updateJob: async (id: string, data: any) => {
    const response = await api.patch(`/jobs/${id}`, data);
    return response.data;
  },
  deleteJob: async (id: string) => {
    const response = await api.delete(`/jobs/${id}`);
    return response.data;
  },
  getApplicationsForJob: async (jobId: string) => {
    const response = await api.get(`/applications?jobId=${jobId}`);
    return response.data;
  }
};

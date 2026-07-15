import api from '../api';

export const employerService = {
  getEmployers: async () => {
    const response = await api.get('/employers');
    return response.data;
  },
  getEmployer: async (id: string) => {
    const response = await api.get(`/employers/${id}`);
    return response.data;
  },
  updateEmployer: async (id: string, data: any) => {
    const response = await api.patch(`/employers/${id}`, data);
    return response.data;
  },
  getJobs: async (employerId: string) => {
    const response = await api.get(`/jobs?employerId=${employerId}`);
    return response.data;
  }
};

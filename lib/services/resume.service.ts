import api from '../api';

export const resumeService = {
  getResumes: async (candidateId: string) => {
    const response = await api.get(`/resumes?candidateId=${candidateId}`);
    return response.data;
  },
  getResume: async (id: string) => {
    const response = await api.get(`/resumes/${id}`);
    return response.data;
  },
  createResume: async (data: any) => {
    const response = await api.post('/resumes', data);
    return response.data;
  },
  updateResume: async (id: string, data: any) => {
    const response = await api.patch(`/resumes/${id}`, data);
    return response.data;
  },
  deleteResume: async (id: string) => {
    const response = await api.delete(`/resumes/${id}`);
    return response.data;
  }
};

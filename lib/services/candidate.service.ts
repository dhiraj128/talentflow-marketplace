import api from '../api';

export const candidateService = {
  getCandidates: async () => {
    const response = await api.get('/candidates');
    return response.data?.data && response.data?.totalPages !== undefined ? response.data.data : response.data;
  },
  getCandidate: async (id: string) => {
    const response = await api.get(`/candidates/${id}`);
    return response.data?.data && response.data?.totalPages !== undefined ? response.data.data : response.data;
  },
  updateCandidate: async (id: string, data: any) => {
    const response = await api.patch(`/candidates/${id}`, data);
    return response.data?.data && response.data?.totalPages !== undefined ? response.data.data : response.data;
  },
  getApplications: async (candidateId: string) => {
    const response = await api.get(`/applications?candidateId=${candidateId}`);
    return response.data?.data && response.data?.totalPages !== undefined ? response.data.data : response.data;
  }
};

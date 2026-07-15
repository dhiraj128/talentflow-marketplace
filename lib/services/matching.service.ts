import api from '../api';

export const matchingService = {
  getMatchScore: async (candidateId: string, jobId: string) => {
    const response = await api.get(`/matching-engine/${candidateId}/${jobId}`);
    return response.data;
  }
};

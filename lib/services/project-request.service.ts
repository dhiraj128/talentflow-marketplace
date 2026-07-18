import api from '../api';

export const projectRequestService = {
  createRequest: async (createData: { freelancerId: string; title: string; description: string; budget: number }) => {
    const { data } = await api.post('/project-requests', createData);
    return data;
  },

  getFreelancerRequests: async () => {
    const { data } = await api.get('/project-requests/freelancer');
    return data;
  },

  getEmployerRequests: async () => {
    const { data } = await api.get('/project-requests/employer');
    return data;
  },

  updateStatus: async (id: string, status: 'ACCEPTED' | 'REJECTED' | 'COMPLETED') => {
    const { data } = await api.patch(`/project-requests/${id}/status`, { status });
    return data;
  },

  createReview: async (id: string, reviewData: { rating: number; text?: string }) => {
    const { data } = await api.post(`/project-requests/${id}/review`, reviewData);
    return data;
  }
};

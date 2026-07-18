import api from '../api';

export const freelancerService = {
  getMarketplace: async (params?: { location?: string; rateMin?: string; rateMax?: string; skills?: string }) => {
    const { data } = await api.get('/freelancers', { params });
    return data;
  },

  getProfile: async (id: string) => {
    const { data } = await api.get(`/freelancers/${id}`);
    return data;
  },

  getMyProfile: async () => {
    const { data } = await api.get('/freelancers/me');
    return data;
  },

  getAdminFreelancers: async () => {
    const { data } = await api.get('/freelancers/admin/all');
    return data;
  },

  updateMyProfile: async (updateData: any) => {
    const { data } = await api.patch('/freelancers/me', updateData);
    return data;
  },
  
  verifyFreelancer: async (id: string, isVerified: boolean) => {
    const { data } = await api.patch(`/freelancers/${id}/verify`, { isVerified });
    return data;
  }
};

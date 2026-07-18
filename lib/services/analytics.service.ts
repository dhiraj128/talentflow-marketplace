import api from '../api';

export const analyticsService = {
  getStats: async () => {
    const response = await api.get('/analytics/stats');
    return response.data?.data && response.data?.totalPages !== undefined ? response.data.data : response.data;
  },
  getCandidateDashboard: async () => {
    const response = await api.get('/analytics/dashboard/candidate');
    return response.data?.data && response.data?.totalPages !== undefined ? response.data.data : response.data;
  },
  getEmployerDashboard: async () => {
    const response = await api.get('/analytics/dashboard/employer');
    return response.data?.data && response.data?.totalPages !== undefined ? response.data.data : response.data;
  },
  getFreelancerDashboard: async () => {
    const response = await api.get('/analytics/dashboard/freelancer');
    return response.data?.data && response.data?.totalPages !== undefined ? response.data.data : response.data;
  },
  getTrainerDashboard: async () => {
    const response = await api.get('/analytics/dashboard/trainer');
    return response.data?.data && response.data?.totalPages !== undefined ? response.data.data : response.data;
  },
  getAdminDashboard: async () => {
    const response = await api.get('/analytics/dashboard/admin');
    return response.data?.data && response.data?.totalPages !== undefined ? response.data.data : response.data;
  }
};

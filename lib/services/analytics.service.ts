import api from '../api';

export const analyticsService = {
  getStats: async () => {
    const response = await api.get('/analytics/stats');
    return response.data;
  },
  getCandidateDashboard: async () => {
    const response = await api.get('/analytics/dashboard/candidate');
    return response.data;
  },
  getEmployerDashboard: async () => {
    const response = await api.get('/analytics/dashboard/employer');
    return response.data;
  },
  getFreelancerDashboard: async () => {
    const response = await api.get('/analytics/dashboard/freelancer');
    return response.data;
  },
  getTrainerDashboard: async () => {
    const response = await api.get('/analytics/dashboard/trainer');
    return response.data;
  },
  getAdminDashboard: async () => {
    const response = await api.get('/analytics/dashboard/admin');
    return response.data;
  }
};

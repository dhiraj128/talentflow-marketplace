import api from '../api';

export const analyticsService = {
  getStats: async () => {
    const response = await api.get('/analytics/stats');
    return response.data;
  }
};

import api from '../api';

export const searchService = {
  saveSearch: async (data: { name: string; searchType?: string; queryJson: any }) => {
    const response = await api.post('/saved-searches', data);
    return response.data;
  },

  getSavedSearches: async () => {
    const response = await api.get('/saved-searches');
    return response.data;
  },

  deleteSavedSearch: async (id: string) => {
    const response = await api.delete(`/saved-searches/${id}`);
    return response.data;
  },

  createJobAlert: async (data: { name: string; queryJson: any; frequency?: string; savedSearchId?: string }) => {
    const response = await api.post('/job-alerts', data);
    return response.data;
  },

  getJobAlerts: async () => {
    const response = await api.get('/job-alerts');
    return response.data;
  },

  deleteJobAlert: async (id: string) => {
    const response = await api.delete(`/job-alerts/${id}`);
    return response.data;
  },

  getRecommendedCandidatesForJob: async (jobId: string) => {
    const response = await api.get(`/jobs/${jobId}/recommended-candidates`);
    return response.data?.data || response.data;
  },

  getSearchAnalyticsOverview: async () => {
    const response = await api.get('/search-analytics/admin/overview');
    return response.data;
  },
};

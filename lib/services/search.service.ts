import api from '../api';

export const searchService = {
  searchJobs: async (query?: string, filters?: any) => {
    const params = new URLSearchParams();
    if (query) params.append('q', query);
    if (filters?.location) params.append('location', filters.location);
    if (filters?.remote) params.append('remote', 'true');
    if (filters?.sort) params.append('sort', filters.sort);
    if (filters?.page) params.append('page', String(filters.page));
    const response = await api.get(`/jobs?${params.toString()}`);
    return response.data;
  },

  searchTalent: async (query?: string, location?: string) => {
    const params = new URLSearchParams();
    if (query) params.append('search', query);
    if (location) params.append('location', location);
    const response = await api.get(`/talent-crm/candidates?${params.toString()}`);
    return response.data?.data || response.data;
  },

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

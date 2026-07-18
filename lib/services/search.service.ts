import api from '../api';

export type SearchType = 'talent' | 'jobs' | 'freelancers' | 'courses';

export interface SearchSuggestion {
  id: string;
  title: string;
  subtitle?: string;
  icon?: any;
  matchScore?: number;
}

export interface SearchSuggestionsResponse {
  suggestions?: SearchSuggestion[];
}

class SearchService {
  async getSuggestions(query: string, type: SearchType, signal?: AbortSignal): Promise<SearchSuggestionsResponse> {
    const config = signal ? { signal } : {};
    try {
      const response = await api.get(`/search/suggestions?q=${encodeURIComponent(query)}&type=${type}`, config);
      return response.data?.data && response.data?.totalPages !== undefined ? response.data.data : response.data;
    } catch (error: any) {
      if (error.name === 'CanceledError' || error.name === 'AbortError') throw error;
      return { suggestions: [] };
    }
  }

  async getJobSuggestions(query: string, signal?: AbortSignal): Promise<{ suggestions: { text: string; type: string }[] }> {
    const config = signal ? { signal } : {};
    try {
      const response = await api.get(`/search/suggestions?q=${encodeURIComponent(query)}`, config);
      return response.data?.data && response.data?.totalPages !== undefined ? response.data.data : response.data;
    } catch (error: any) {
      if (error.name === 'CanceledError' || error.name === 'AbortError') throw error;
      return { suggestions: [] };
    }
  }

  async getLocationSuggestions(query: string, signal?: AbortSignal): Promise<{ locations: string[] }> {
    const config = signal ? { signal } : {};
    try {
      const response = await api.get(`/search/locations?q=${encodeURIComponent(query)}`, config);
      return response.data?.data && response.data?.totalPages !== undefined ? response.data.data : response.data;
    } catch (error: any) {
      if (error.name === 'CanceledError' || error.name === 'AbortError') throw error;
      return { locations: [] };
    }
  }

  async getPopularSearches(type: SearchType): Promise<string[]> {
    try {
      const response = await api.get(`/search/popular?type=${type}`);
      return response.data?.data && response.data?.totalPages !== undefined ? response.data.data : response.data;
    } catch {
      return [];
    }
  }

  async getTrendingSkills(): Promise<string[]> {
    try {
      const response = await api.get(`/search/trending-skills`);
      return response.data?.data && response.data?.totalPages !== undefined ? response.data.data : response.data;
    } catch {
      return [];
    }
  }

  async searchTalent(query: string, location: string): Promise<any[]> {
    const response = await api.get(`/users?role=CANDIDATE&q=${encodeURIComponent(query)}&location=${encodeURIComponent(location)}`);
    return response.data?.data && response.data?.totalPages !== undefined ? response.data.data : response.data;
  }

  async searchJobs(query: string, location: string): Promise<any[]> {
    const response = await api.get(`/jobs?q=${encodeURIComponent(query)}&location=${encodeURIComponent(location)}`);
    return response.data?.data && response.data?.totalPages !== undefined ? response.data.data : response.data;
  }

  async searchFreelancers(query: string, location: string): Promise<any[]> {
    const response = await api.get(`/users?role=FREELANCER&q=${encodeURIComponent(query)}&location=${encodeURIComponent(location)}`);
    return response.data?.data && response.data?.totalPages !== undefined ? response.data.data : response.data;
  }

  async searchCourses(query: string, location: string): Promise<any[]> {
    const response = await api.get(`/courses?q=${encodeURIComponent(query)}&location=${encodeURIComponent(location)}`);
    return response.data?.data && response.data?.totalPages !== undefined ? response.data.data : response.data;
  }
}

export const searchService = new SearchService();

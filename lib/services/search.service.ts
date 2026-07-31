import api from '@/lib/api';

export type SearchType = 'JOB' | 'TALENT' | 'FREELANCER' | 'COURSE';

export interface SearchSuggestionsResponse {
  suggestions: { text: string; type: string }[];
}

export interface UnifiedSearchResults {
  query: string;
  totalResults: number;
  jobs: any[];
  talent: any[];
  freelancers: any[];
  courses: any[];
}

export class UnifiedSearchService {
  static async searchUnified(query: string): Promise<UnifiedSearchResults> {
    const res = await api.get('/search/unified', { params: { q: query } });
    return res.data;
  }

  static async searchTalent(query?: string, location?: string): Promise<any[]> {
    const res = await api.get('/search/talent', { params: { q: query, location } });
    return res.data;
  }

  static async searchJobs(query?: string, location?: string): Promise<any[]> {
    const res = await api.get('/search/jobs', { params: { q: query, location } });
    return res.data;
  }

  static async searchFreelancers(params?: {
    q?: string;
    location?: string;
    minRate?: number;
    maxRate?: number;
    minRating?: number;
  }): Promise<any[]> {
    const res = await api.get('/search/freelancers', { params });
    return res.data;
  }

  static async searchCourses(query?: string, category?: string): Promise<any[]> {
    const res = await api.get('/search/courses', { params: { q: query, category } });
    return res.data;
  }

  static async getSuggestions(query: string, type?: any, signal?: any): Promise<{ suggestions: any[] }> {
    const res = await api.get('/search/suggestions', { params: { q: query }, signal });
    return res.data;
  }

  static async getLocations(query: string, signal?: any): Promise<{ locations: string[] }> {
    const res = await api.get('/search/locations', { params: { q: query }, signal });
    return res.data;
  }
}

export const searchService = {
  search: (query: string) => UnifiedSearchService.searchUnified(query),
  searchTalent: (query?: string, location?: string) => UnifiedSearchService.searchTalent(query, location),
  searchJobs: (query?: string, location?: string) => UnifiedSearchService.searchJobs(query, location),
  searchFreelancers: (params?: any) => UnifiedSearchService.searchFreelancers(params),
  searchCourses: (query?: string, category?: string) => UnifiedSearchService.searchCourses(query, category),
  getSuggestions: (query: string, type?: any, signal?: any) => UnifiedSearchService.getSuggestions(query, type, signal),
  getLocations: (query: string, signal?: any) => UnifiedSearchService.getLocations(query, signal),
  getPopularSearches: async (type?: any) => ['Developer', 'Engineer', 'Designer', 'Architect', 'Consultant'],
  getTrendingSkills: async () => ['React', 'TypeScript', 'Node.js', 'Next.js', 'Python', 'Figma', 'AWS', 'GraphQL'],
};

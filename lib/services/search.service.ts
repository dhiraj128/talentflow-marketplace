// TODO: Backend Integration Required
// This service currently relies on mock-db for search functionality.
// Replace with real API calls (e.g., api.get('/search')) once the backend search endpoints are implemented.
import { unifiedJobs, unifiedTalent, unifiedFreelancers, unifiedCourses } from "../data/mock-db";

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

// Levenshtein distance for typo tolerance
function levenshteinDistance(a: string, b: string): number {
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;
  const matrix = Array(b.length + 1).fill(null).map(() => Array(a.length + 1).fill(null));
  for (let i = 0; i <= a.length; i += 1) matrix[0][i] = i;
  for (let j = 0; j <= b.length; j += 1) matrix[j][0] = j;
  for (let j = 1; j <= b.length; j += 1) {
    for (let i = 1; i <= a.length; i += 1) {
      const indicator = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[j][i] = Math.min(
        matrix[j][i - 1] + 1,
        matrix[j - 1][i] + 1,
        matrix[j - 1][i - 1] + indicator
      );
    }
  }
  return matrix[b.length][a.length];
}

// Calculate match score (higher is better)
function calculateMatchScore(text: string, query: string): number {
  const t = text.toLowerCase().trim();
  const q = query.toLowerCase().trim().replace(/\s+/g, ' ');
  
  if (t === q) return 100;
  if (t.startsWith(q)) return 80;
  if (t.includes(q)) return 60;
  
  const qWords = q.split(' ');
  const tWords = t.split(' ');
  const allWordsMatch = qWords.every(qw => t.includes(qw));
  if (allWordsMatch) return 40;
  
  // Fuzzy match on each word
  let fuzzyMatches = 0;
  for (const qw of qWords) {
    for (const tw of tWords) {
      if (Math.abs(qw.length - tw.length) <= 2) {
        const dist = levenshteinDistance(qw, tw);
        if (dist <= 1 || (qw.length > 5 && dist <= 2)) {
          fuzzyMatches++;
          break;
        }
      }
    }
  }
  if (fuzzyMatches === qWords.length) return 20;
  
  return 0;
}

// Filter and rank data
function filterAndRank<T>(data: T[], query: string, field: keyof T, additionalFields: (keyof T)[] = []): { item: T, score: number }[] {
  if (!query) return data.map(item => ({ item, score: 0 }));
  
  const scoredData = data.map(item => {
    let bestScore = calculateMatchScore(String(item[field]), query);
    
    for (const af of additionalFields) {
      const val = item[af];
      if (Array.isArray(val)) {
        for (const v of val) {
          const score = calculateMatchScore(String(v), query);
          // skills matches get a slight penalty so direct title matches rank higher
          if (score > 0 && (score - 5) > bestScore) bestScore = score - 5;
        }
      } else if (val) {
        const score = calculateMatchScore(String(val), query);
        if (score > bestScore) bestScore = score;
      }
    }
    
    return { item, score: bestScore };
  });
  
  return scoredData.filter(d => d.score > 0).sort((a, b) => b.score - a.score);
}

function applyLocationFilter(results: any[], location: string) {
  if (!location) return results;
  const locLower = location.toLowerCase().trim();
  return results.filter(r => r.location && r.location.toLowerCase().includes(locLower));
}

class SearchService {
  async getSuggestions(query: string, type: SearchType, signal?: AbortSignal): Promise<SearchSuggestionsResponse> {
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        let results: any[] = [];
        let mainField = 'title';
        let additionalFields: string[] = [];
        
        if (type === 'talent') { results = unifiedTalent; mainField = 'role'; additionalFields = ['skills']; }
        else if (type === 'jobs') { results = unifiedJobs; mainField = 'title'; additionalFields = ['skills']; }
        else if (type === 'freelancers') { results = unifiedFreelancers; mainField = 'role'; additionalFields = ['skills']; }
        else if (type === 'courses') { results = unifiedCourses; mainField = 'title'; additionalFields = ['tags']; }

        const ranked = filterAndRank(results, query, mainField as any, additionalFields as any);
        let suggestionsList: string[] = [];
        
        if (ranked.length > 0) {
          const uniqueSet = new Set<string>();
          ranked.forEach(d => uniqueSet.add(String(d.item[mainField])));
          suggestionsList = Array.from(uniqueSet).slice(0, 8);
        } else {
          // Fallback: if no direct or fuzzy matches, show related skills or popular
          // Just return empty so the UI shows "No results found" eventually, 
          // but for suggestions, we can show "Try Exact Match" or popular.
          // The prompt says: "Do NOT immediately show No Results Found. Instead try Exact -> Contains -> Similar Skills -> Related Jobs -> Popular Jobs"
          // We handled Exact -> Contains -> Similar Skills (via additionalFields) in filterAndRank.
          // If still empty, return popular jobs as fallback.
          let fallback: any[] = [];
          if (type === 'talent') fallback = unifiedTalent;
          else if (type === 'jobs') fallback = unifiedJobs;
          else if (type === 'freelancers') fallback = unifiedFreelancers;
          else if (type === 'courses') fallback = unifiedCourses;
          
          const uniqueSet = new Set<string>();
          fallback.slice(0, 5).forEach(d => uniqueSet.add(String(d[mainField])));
          suggestionsList = Array.from(uniqueSet);
        }

        const response: SearchSuggestionsResponse = {
          suggestions: suggestionsList.map((s, i) => ({ id: `sugg-${i}`, title: s }))
        };

        resolve(response);
      }, 300);

      if (signal) {
        signal.addEventListener('abort', () => {
          clearTimeout(timer);
          reject(new DOMException('Aborted', 'AbortError'));
        });
      }
    });
  }

  async getPopularSearches(type: SearchType): Promise<string[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (type === 'talent') resolve(['Software Engineer', 'React Developer', 'Data Analyst']);
        if (type === 'jobs') resolve(['React Developer', 'Node.js Developer', 'Software Engineer']);
        if (type === 'freelancers') resolve(['UI/UX Designer', 'Web Developer', 'Copywriter']);
        if (type === 'courses') resolve(['Python', 'AWS Certification', 'React']);
      }, 100);
    });
  }

  async getTrendingSkills(): Promise<string[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(['React', 'Node.js', 'Python', 'AWS', 'Figma']);
      }, 100);
    });
  }

  async searchTalent(query: string, location: string): Promise<any[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        let ranked = filterAndRank(unifiedTalent, query, 'role', ['skills', 'name']);
        if (ranked.length === 0 && query) {
          // Fallback
          ranked = unifiedTalent.slice(0, 3).map(item => ({ item, score: 0 }));
        } else if (!query) {
          ranked = unifiedTalent.map(item => ({ item, score: 0 }));
        }
        const results = ranked.map(r => r.item);
        resolve(applyLocationFilter(results, location));
      }, 300);
    });
  }

  async searchJobs(query: string, location: string): Promise<any[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        let ranked = filterAndRank(unifiedJobs, query, 'title', ['skills', 'company']);
        if (ranked.length === 0 && query) {
          ranked = unifiedJobs.slice(0, 3).map(item => ({ item, score: 0 }));
        } else if (!query) {
          ranked = unifiedJobs.map(item => ({ item, score: 0 }));
        }
        const results = ranked.map(r => r.item);
        resolve(applyLocationFilter(results, location));
      }, 300);
    });
  }

  async searchFreelancers(query: string, location: string): Promise<any[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        let ranked = filterAndRank(unifiedFreelancers, query, 'role', ['skills', 'name']);
        if (ranked.length === 0 && query) {
          ranked = unifiedFreelancers.slice(0, 3).map(item => ({ item, score: 0 }));
        } else if (!query) {
          ranked = unifiedFreelancers.map(item => ({ item, score: 0 }));
        }
        const results = ranked.map(r => r.item);
        resolve(applyLocationFilter(results, location));
      }, 300);
    });
  }

  async searchCourses(query: string, location: string): Promise<any[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        let ranked = filterAndRank(unifiedCourses, query, 'title', ['tags', 'category']);
        if (ranked.length === 0 && query) {
          ranked = unifiedCourses.slice(0, 3).map(item => ({ item, score: 0 }));
        } else if (!query) {
          ranked = unifiedCourses.map(item => ({ item, score: 0 }));
        }
        const results = ranked.map(r => r.item);
        resolve(applyLocationFilter(results, location));
      }, 300);
    });
  }
}

export const searchService = new SearchService();

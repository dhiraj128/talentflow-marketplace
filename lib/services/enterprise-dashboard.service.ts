import api from '../api';
import { DashboardResponse, DashboardMetric, LearningProgress, CategoryAnalytics, ActivityItem, TeamMember } from '../types/enterprise';

export const enterpriseDashboardService = {
  async getDashboard(): Promise<DashboardResponse> {
    const response = await api.get('/analytics/dashboard');
    return response.data;
  },

  async getMetrics(): Promise<DashboardMetric[]> {
    const response = await api.get('/analytics/metrics');
    return response.data;
  },

  async getLearningProgress(): Promise<LearningProgress[]> {
    const response = await api.get('/analytics/learning-progress');
    return response.data;
  },

  async getCategoryAnalytics(): Promise<CategoryAnalytics[]> {
    const response = await api.get('/analytics/categories');
    return response.data;
  },

  async getRecentActivities(): Promise<ActivityItem[]> {
    const response = await api.get('/analytics/activities');
    return response.data;
  },

  async getTeamMembers(): Promise<TeamMember[]> {
    const response = await api.get('/analytics/team');
    return response.data;
  }
};

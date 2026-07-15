// TODO: Backend Integration Required
// This service currently relies on mock data for the enterprise dashboard.
// Replace with real API calls (e.g., api.get('/analytics/dashboard')) once the backend analytics endpoints are implemented.
import { DashboardResponse, DashboardMetric, LearningProgress, CategoryAnalytics, ActivityItem, TeamMember } from '../types/enterprise';

// Simulated delay to mimic network request
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const enterpriseDashboardService = {
  async getDashboard(): Promise<DashboardResponse> {
    await delay(1200); // simulate full network latency
    
    return {
      metrics: await this.getMetrics(),
      learningProgress: await this.getLearningProgress(),
      categoryAnalytics: await this.getCategoryAnalytics(),
      recentActivities: await this.getRecentActivities(),
      teamMembers: await this.getTeamMembers(),
      totalTeamMembers: 24,
    };
  },

  async getMetrics(): Promise<DashboardMetric[]> {
    await delay(300);
    return [
      { id: '1', label: 'Total Learners', value: '2,450', trend: '+12%', isPositive: true, iconName: 'Users' },
      { id: '2', label: 'Completed', value: '842', trend: '+5%', isPositive: true, iconName: 'CheckCircle2' },
      { id: '3', label: 'Certificates', value: '1,120', trend: '+18%', isPositive: true, iconName: 'Award' },
      { id: '4', label: 'Avg Rate', value: '86%', trend: '+2%', isPositive: true, iconName: 'Activity' },
    ];
  },

  async getLearningProgress(): Promise<LearningProgress[]> {
    await delay(300);
    return [
      { id: 'w1', date: 'Week 1', value: 35 },
      { id: 'w2', date: 'Week 2', value: 25 },
      { id: 'w3', date: 'Week 3', value: 20 },
      { id: 'w4', date: 'Week 4', value: 15 },
      { id: 'w5', date: 'Week 5', value: 30 },
      { id: 'w6', date: 'Week 6', value: 10 },
      { id: 'w7', date: 'Week 7', value: 15 },
      { id: 'w8', date: 'Week 8', value: 5 },
    ];
  },

  async getCategoryAnalytics(): Promise<CategoryAnalytics[]> {
    await delay(300);
    return [
      { id: 'c1', name: 'Technical', value: 45, color: '#3b82f6' },
      { id: 'c2', name: 'Leadership', value: 30, color: '#8b5cf6' },
      { id: 'c3', name: 'Soft Skills', value: 15, color: '#10b981' },
      { id: 'c4', name: 'Compliance', value: 10, color: '#f59e0b' },
    ];
  },

  async getRecentActivities(): Promise<ActivityItem[]> {
    await delay(300);
    return [
      {
        id: 'a1',
        user: { name: 'John Smith', avatarInitials: 'JS', avatarColor: 'bg-blue-600' },
        action: 'completed',
        course: 'Advanced React Development',
        timestamp: '2h ago',
      },
    ];
  },

  async getTeamMembers(): Promise<TeamMember[]> {
    await delay(300);
    return [
      { id: 't1', name: 'Michael K.', initials: 'MK', color: 'bg-emerald-600', isOnline: true },
      { id: 't2', name: 'Alex L.', initials: 'AL', color: 'bg-indigo-600', isOnline: false },
      { id: 't3', name: 'Tom R.', initials: 'TR', color: 'bg-amber-600', isOnline: true },
      { id: 't4', name: 'Sarah D.', initials: 'SD', color: 'bg-rose-600', isOnline: true },
    ];
  }
};

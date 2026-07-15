export interface DashboardMetric {
  id: string;
  label: string;
  value: string | number;
  trend: string;
  isPositive: boolean;
  iconName?: string;
}

export interface LearningProgress {
  id: string;
  date: string;
  value: number;
}

export interface CategoryAnalytics {
  id: string;
  name: string;
  value: number;
  color: string;
}

export interface ActivityItem {
  id: string;
  user: {
    name: string;
    avatarInitials: string;
    avatarColor: string;
  };
  action: string;
  course: string;
  timestamp: string;
}

export interface TeamMember {
  id: string;
  initials: string;
  color: string;
  name: string;
  isOnline?: boolean;
}

export interface DashboardResponse {
  metrics: DashboardMetric[];
  learningProgress: LearningProgress[];
  categoryAnalytics: CategoryAnalytics[];
  recentActivities: ActivityItem[];
  teamMembers: TeamMember[];
  totalTeamMembers: number;
}

import api from '../api';

export interface TrainerDashboardData {
  publishedCourses: number;
  draftCourses: number;
  totalStudents: number;
  revenue: number;
  courseRating: number;
  certificatesIssued: number;
  courseCompletionRate: number;
  recentCourses?: any[];
}

class TrainerService {
  async getTrainerDashboard(): Promise<any> {
    const response = await api.get('/analytics/dashboard/trainer');
    return response.data?.data && response.data?.totalPages !== undefined ? response.data.data : response.data;
  }
}

export const trainerService = new TrainerService();

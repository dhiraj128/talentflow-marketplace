export interface TrainerDashboardData {
  publishedCourses: number;
  draftCourses: number;
  totalStudents: number;
  revenue: number;
  courseRating: number;
  certificatesIssued: number;
  courseCompletionRate: number;
}

class TrainerService {
  async getTrainerDashboard(): Promise<TrainerDashboardData> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          publishedCourses: 5,
          draftCourses: 2,
          totalStudents: 1450,
          revenue: 28400,
          courseRating: 4.8,
          certificatesIssued: 950,
          courseCompletionRate: 65,
        });
      }, 500);
    });
  }
}

export const trainerService = new TrainerService();

export interface FreelancerDashboardData {
  totalEarnings: number;
  activeProjects: number;
  pendingProposals: number;
  completedProjects: number;
  profileCompletion: number;
  portfolioCompletion: number;
  rating: number;
  messages: number;
}

class FreelancerService {
  async getFreelancerDashboard(): Promise<FreelancerDashboardData> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          totalEarnings: 12500,
          activeProjects: 3,
          pendingProposals: 5,
          completedProjects: 14,
          profileCompletion: 100,
          portfolioCompletion: 85,
          rating: 4.9,
          messages: 2,
        });
      }, 500);
    });
  }
}

export const freelancerService = new FreelancerService();

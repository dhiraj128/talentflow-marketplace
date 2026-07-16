import api from '../api';

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
    const response = await api.get('/freelancer/dashboard');
    return response.data;
  }
}

export const freelancerService = new FreelancerService();

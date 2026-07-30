import api from '../api';

export const talentCrmService = {
  searchTalent: async (params?: { search?: string; location?: string; page?: number; limit?: number }) => {
    const query = new URLSearchParams(params as any).toString();
    const response = await api.get(`/talent-crm/search${query ? `?${query}` : ''}`);
    return response.data;
  },
  saveCandidate: async (candidateId: string, isFavorite: boolean = false) => {
    const response = await api.post(`/talent-crm/saved/${candidateId}`, { isFavorite });
    return response.data;
  },
  unsaveCandidate: async (candidateId: string) => {
    const response = await api.delete(`/talent-crm/saved/${candidateId}`);
    return response.data;
  },
  getSavedCandidates: async (params?: { favoritesOnly?: boolean; page?: number; limit?: number }) => {
    const query = new URLSearchParams(params as any).toString();
    const response = await api.get(`/talent-crm/saved${query ? `?${query}` : ''}`);
    return response.data;
  },
  createPool: async (name: string, description?: string) => {
    const response = await api.post(`/talent-crm/pools`, { name, description });
    return response.data;
  },
  getPools: async () => {
    const response = await api.get(`/talent-crm/pools`);
    return response.data;
  },
  getPool: async (id: string) => {
    const response = await api.get(`/talent-crm/pools/${id}`);
    return response.data;
  },
  updatePool: async (id: string, name: string, description?: string) => {
    const response = await api.patch(`/talent-crm/pools/${id}`, { name, description });
    return response.data;
  },
  deletePool: async (id: string) => {
    const response = await api.delete(`/talent-crm/pools/${id}`);
    return response.data;
  },
  addMemberToPool: async (poolId: string, candidateId: string) => {
    const response = await api.post(`/talent-crm/pools/${poolId}/members/${candidateId}`);
    return response.data;
  },
  removeMemberFromPool: async (poolId: string, candidateId: string) => {
    const response = await api.delete(`/talent-crm/pools/${poolId}/members/${candidateId}`);
    return response.data;
  },
  createInvitation: async (candidateId: string, jobId: string, message?: string) => {
    const response = await api.post(`/talent-crm/invitations`, { candidateId, jobId, message });
    return response.data;
  },
  getEmployerInvitations: async () => {
    const response = await api.get(`/talent-crm/invitations/employer`);
    return response.data;
  },
  getCandidateInvitations: async () => {
    const response = await api.get(`/talent-crm/invitations/candidate`);
    return response.data;
  },
  declineInvitation: async (id: string) => {
    const response = await api.patch(`/talent-crm/invitations/${id}/decline`);
    return response.data;
  },
  cancelInvitation: async (id: string) => {
    const response = await api.patch(`/talent-crm/invitations/${id}/cancel`);
    return response.data;
  },
  acceptInvitationAndApply: async (id: string) => {
    const response = await api.post(`/talent-crm/invitations/${id}/accept-and-apply`);
    return response.data;
  },
  getAnalytics: async () => {
    const response = await api.get(`/talent-crm/analytics`);
    return response.data;
  },
};

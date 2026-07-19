import api from '../api';

export const notificationService = {
  getNotifications: async (params?: { userId?: string; skip?: number; take?: number }) => {
    const query = new URLSearchParams(params as any).toString();
    const response = await api.get(`/notifications${query ? `?${query}` : ''}`);
    
    // Handle various response formats from the backend (could be raw array, {data: []}, etc.)
    if (Array.isArray(response.data)) return response.data;
    if (response.data && Array.isArray(response.data.data)) return response.data.data;
    if (response.data && response.data.items && Array.isArray(response.data.items)) return response.data.items;
    
    return [];
  },
  markAsRead: async (id: string) => {
    const response = await api.patch(`/notifications/${id}`, { isRead: true });
    return response.data?.data && response.data?.totalPages !== undefined ? response.data.data : response.data;
  }
};

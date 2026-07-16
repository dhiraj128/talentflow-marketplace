import api from '../api';

export const notificationService = {
  getNotifications: async (params?: { userId?: string; skip?: number; take?: number }) => {
    const query = new URLSearchParams(params as any).toString();
    const response = await api.get(`/notifications${query ? `?${query}` : ''}`);
    return response.data;
  },
  markAsRead: async (id: string) => {
    const response = await api.patch(`/notifications/${id}`, { isRead: true });
    return response.data;
  }
};

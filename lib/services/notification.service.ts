import api from '../api';

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  link?: string;
  url?: string;
}

export interface NotificationsResponse {
  data: NotificationItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  unreadCount: number;
}

export const notificationService = {
  getNotifications: async (params?: { page?: number; limit?: number; unreadOnly?: boolean }): Promise<NotificationsResponse> => {
    const cleanParams: any = {};
    if (params?.page) cleanParams.page = params.page;
    if (params?.limit) cleanParams.limit = params.limit;
    if (params?.unreadOnly) cleanParams.unreadOnly = 'true';

    const query = new URLSearchParams(cleanParams).toString();
    const response = await api.get(`/notifications${query ? `?${query}` : ''}`);

    if (response.data && Array.isArray(response.data.data)) {
      return {
        data: response.data.data,
        total: response.data.total || response.data.data.length,
        page: response.data.page || 1,
        limit: response.data.limit || 20,
        totalPages: response.data.totalPages || 1,
        unreadCount: response.data.unreadCount ?? 0,
      };
    }

    if (Array.isArray(response.data)) {
      const arr = response.data;
      return {
        data: arr,
        total: arr.length,
        page: 1,
        limit: 20,
        totalPages: 1,
        unreadCount: arr.filter((n: any) => !n.isRead).length,
      };
    }

    return {
      data: [],
      total: 0,
      page: 1,
      limit: 20,
      totalPages: 0,
      unreadCount: 0,
    };
  },

  getUnreadCount: async (): Promise<number> => {
    try {
      const response = await api.get('/notifications/unread-count');
      return response.data?.count ?? 0;
    } catch {
      return 0;
    }
  },

  markAsRead: async (id: string) => {
    const response = await api.patch(`/notifications/${id}/read`);
    return response.data;
  },

  markAllAsRead: async () => {
    const response = await api.patch('/notifications/read-all');
    return response.data;
  },

  deleteNotification: async (id: string) => {
    const response = await api.delete(`/notifications/${id}`);
    return response.data;
  },
};

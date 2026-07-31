import api from '../api';

export const messageService = {
  getConversations: async (userId?: string) => {
    const query = userId ? `?userId=${userId}` : '';
    const response = await api.get(`/messages/conversations${query}`);
    return response.data?.data && response.data?.totalPages !== undefined ? response.data.data : response.data;
  },
  createConversation: async (data: {
    participant1Id: string;
    participant2Id: string;
    applicationId?: string;
    jobId?: string;
    candidateInvitationId?: string;
    interviewId?: string;
    offerId?: string;
  }) => {
    const response = await api.post('/messages/conversations', data);
    return response.data?.data && response.data?.totalPages !== undefined ? response.data.data : response.data;
  },
  getMessages: async (conversationId: string) => {
    const response = await api.get(`/messages/conversations/${conversationId}`);
    return response.data?.data && response.data?.totalPages !== undefined ? response.data.data : response.data;
  },
  sendMessage: async (data: {
    conversationId: string;
    content: string;
    storageKey?: string;
    fileName?: string;
    mimeType?: string;
  }) => {
    const response = await api.post('/messages', data);
    return response.data?.data && response.data?.totalPages !== undefined ? response.data.data : response.data;
  },
  getUnreadCount: async () => {
    const response = await api.get('/messages/unread-count');
    return response.data;
  },
  archiveConversation: async (conversationId: string) => {
    const response = await api.patch(`/messages/conversations/${conversationId}/archive`, {});
    return response.data;
  },
  markAsRead: async (id: string) => {
    const response = await api.patch(`/messages/${id}/read`, {});
    return response.data?.data && response.data?.totalPages !== undefined ? response.data.data : response.data;
  },
};

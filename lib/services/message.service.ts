import api from '../api';

export const messageService = {
  getConversations: async (userId: string) => {
    const response = await api.get(`/messages/conversations?userId=${userId}`);
    return response.data;
  },
  createConversation: async (participant1Id: string, participant2Id: string) => {
    const response = await api.post('/messages/conversations', { participant1Id, participant2Id });
    return response.data;
  },
  getMessages: async (conversationId: string) => {
    const response = await api.get(`/messages/conversations/${conversationId}`);
    return response.data;
  },
  sendMessage: async (conversationId: string, senderId: string, content: string) => {
    const response = await api.post('/messages', { conversationId, senderId, content });
    return response.data;
  },
  markAsRead: async (id: string) => {
    const response = await api.patch(`/messages/${id}/read`, {});
    return response.data;
  }
};

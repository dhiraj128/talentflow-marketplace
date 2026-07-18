import api from '../api';

export const userService = {
  getUsers: async () => {
    const response = await api.get('/users');
    return response.data?.data && response.data?.totalPages !== undefined ? response.data.data : response.data;
  },
  getUser: async (id: string) => {
    const response = await api.get(`/users/${id}`);
    return response.data?.data && response.data?.totalPages !== undefined ? response.data.data : response.data;
  },
  updateUser: async (id: string, data: any) => {
    const response = await api.patch(`/users/${id}`, data);
    return response.data?.data && response.data?.totalPages !== undefined ? response.data.data : response.data;
  },
  deleteUser: async (id: string) => {
    const response = await api.delete(`/users/${id}`);
    return response.data?.data && response.data?.totalPages !== undefined ? response.data.data : response.data;
  }
};

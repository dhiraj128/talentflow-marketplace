import api from '../api';

export const authService = {
  login: async (credentials: any) => {
    const response = await api.post('/auth/login', credentials);
    if (response.data.access_token) {
      if (typeof window !== 'undefined') {
        localStorage.setItem('access_token', response.data.access_token);
        if (response.data.refresh_token) {
          localStorage.setItem('refresh_token', response.data.refresh_token);
        }
        if (response.data.user) {
          localStorage.setItem('user', JSON.stringify(response.data.user));
        }
      }
    }
    return response.data?.data && response.data?.totalPages !== undefined ? response.data.data : response.data;
  },
  register: async (userData: any) => {
    const response = await api.post('/auth/register', userData);
    if (response.data.access_token) {
      if (typeof window !== 'undefined') {
        localStorage.setItem('access_token', response.data.access_token);
        localStorage.setItem('refresh_token', response.data.refresh_token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
    }
    return response.data?.data && response.data?.totalPages !== undefined ? response.data.data : response.data;
  },
  logout: async () => {
    try {
      await api.post('/auth/logout');
    } catch (e) {
      console.warn('Logout failed on server');
    }
    if (typeof window !== 'undefined') {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
    }
  },
  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data?.data && response.data?.totalPages !== undefined ? response.data.data : response.data;
  },
  sendEmailOtp: async (data: { identifier: string; purpose: string }) => {
    const response = await api.post('/auth/send-email-otp', data);
    return response.data;
  },
  sendPhoneOtp: async (data: { identifier: string; purpose: string }) => {
    const response = await api.post('/auth/send-phone-otp', data);
    return response.data;
  },
  verifyEmailOtp: async (data: { identifier: string; code: string; purpose: string }) => {
    const response = await api.post('/auth/verify-email-otp', data);
    return response.data;
  },
  verifyPhoneOtp: async (data: { identifier: string; code: string; purpose: string }) => {
    const response = await api.post('/auth/verify-phone-otp', data);
    return response.data;
  },
  forgotPassword: async (data: { identifier: string }) => {
    const response = await api.post('/auth/forgot-password', data);
    return response.data;
  },
  resetPassword: async (data: { identifier: string; code: string; newPassword: string }) => {
    const response = await api.post('/auth/reset-password', data);
    return response.data;
  }
};

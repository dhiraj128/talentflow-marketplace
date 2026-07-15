import api from '../api';

export const authService = {
  login: async (credentials: any) => {
    // Mocking the backend for demo purposes
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        let role = 'job-seeker';
        if (credentials.email.includes('admin')) role = 'admin';
        if (credentials.email.includes('employer')) role = 'employer';
        if (credentials.email.includes('freelancer')) role = 'freelancer';
        if (credentials.email.includes('trainer')) role = 'trainer';

        const mockResponse = {
          access_token: 'mock_access_token',
          refresh_token: 'mock_refresh_token',
          user: {
            id: '1',
            name: 'Demo User',
            email: credentials.email,
            role: role
          }
        };

        if (typeof window !== 'undefined') {
          localStorage.setItem('access_token', mockResponse.access_token);
          localStorage.setItem('refresh_token', mockResponse.refresh_token);
          localStorage.setItem('user', JSON.stringify(mockResponse.user));
        }
        resolve(mockResponse);
      }, 500);
    });
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
    return response.data;
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
    return response.data;
  }
};

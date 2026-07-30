import api from '../api';

export const certificatesService = {
  getUserCertificates: async () => {
    const response = await api.get('/certificates/my-certificates').catch(() => null);
    return response?.data?.data || response?.data || [];
  },
  getCertificate: async (id: string) => {
    const response = await api.get(`/certificates/${id}`);
    return response.data;
  },
};

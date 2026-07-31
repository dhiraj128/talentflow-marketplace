import api from '../api';

export const offerService = {
  createOffer: async (data: any) => {
    const response = await api.post('/offers', data);
    return response.data;
  },
  getEmployerOffers: async () => {
    const response = await api.get('/offers/employer');
    return response.data;
  },
  getCandidateOffers: async () => {
    const response = await api.get('/offers/candidate');
    return response.data;
  },
  getOffer: async (id: string) => {
    const response = await api.get(`/offers/${id}`);
    return response.data;
  },
  updateOffer: async (id: string, data: any) => {
    const response = await api.patch(`/offers/${id}`, data);
    return response.data;
  },
  sendOffer: async (id: string) => {
    const response = await api.post(`/offers/${id}/send`);
    return response.data;
  },
  acceptOffer: async (id: string) => {
    const response = await api.post(`/offers/${id}/accept`);
    return response.data;
  },
  declineOffer: async (id: string, reason?: string) => {
    const response = await api.post(`/offers/${id}/decline`, { reason });
    return response.data;
  },
  withdrawOffer: async (id: string) => {
    const response = await api.post(`/offers/${id}/withdraw`);
    return response.data;
  },
};

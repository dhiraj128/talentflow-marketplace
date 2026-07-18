import api from '../api';

export const billingService = {
  getInvoices: async () => {
    const response = await api.get('/billing/invoices');
    return response.data?.data && response.data?.totalPages !== undefined ? response.data.data : response.data;
  }
};

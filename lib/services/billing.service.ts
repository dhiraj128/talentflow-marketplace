import api from '../api';

export const billingService = {
  getInvoices: async () => {
    const response = await api.get('/billing/invoices');
    return response.data;
  }
};

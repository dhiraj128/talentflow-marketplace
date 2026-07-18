import api from '../api';

export const adminService = {
  getCategories: () => api.get('/categories').then((res) => res.data),
  createCategory: (data: any) => api.post('/categories', data).then((res) => res.data),
  updateCategory: (id: string, data: any) => api.patch('/categories/' + id, data).then((res) => res.data),
  deleteCategory: (id: string) => api.delete('/categories/' + id).then((res) => res.data),

  getDesignations: () => api.get('/designations').then((res) => res.data),
  createDesignation: (data: any) => api.post('/designations', data).then((res) => res.data),
  updateDesignation: (id: string, data: any) => api.patch('/designations/' + id, data).then((res) => res.data),
  deleteDesignation: (id: string) => api.delete('/designations/' + id).then((res) => res.data),

  getLocations: () => api.get('/locations').then((res) => res.data),
  createLocation: (data: any) => api.post('/locations', data).then((res) => res.data),
  updateLocation: (id: string, data: any) => api.patch('/locations/' + id, data).then((res) => res.data),
  deleteLocation: (id: string) => api.delete('/locations/' + id).then((res) => res.data),

  getSkills: () => api.get('/skills').then((res) => res.data),
  createSkill: (data: any) => api.post('/skills', data).then((res) => res.data),
  updateSkill: (id: string, data: any) => api.patch('/skills/' + id, data).then((res) => res.data),
  deleteSkill: (id: string) => api.delete('/skills/' + id).then((res) => res.data),

  getCoupons: () => api.get('/coupons').then((res) => res.data),
  createCoupon: (data: any) => api.post('/coupons', data).then((res) => res.data),
  updateCoupon: (id: string, data: any) => api.patch('/coupons/' + id, data).then((res) => res.data),
  deleteCoupon: (id: string) => api.delete('/coupons/' + id).then((res) => res.data),

  getOffers: () => api.get('/offers').then((res) => res.data),
  createOffer: (data: any) => api.post('/offers', data).then((res) => res.data),
  updateOffer: (id: string, data: any) => api.patch('/offers/' + id, data).then((res) => res.data),
  deleteOffer: (id: string) => api.delete('/offers/' + id).then((res) => res.data),

  getPlans: () => api.get('/plans').then((res) => res.data),
  createPlan: (data: any) => api.post('/plans', data).then((res) => res.data),
  updatePlan: (id: string, data: any) => api.patch('/plans/' + id, data).then((res) => res.data),
  deletePlan: (id: string) => api.delete('/plans/' + id).then((res) => res.data),

  getSubscriptions: () => api.get('/subscriptions').then((res) => res.data),
  
  getDashboardStats: () => api.get('/analytics/dashboard/admin').then((res) => res.data),
};

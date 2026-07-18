import api from '../api';

export const courseService = {
  getCourses: async (params?: any) => {
    const query = params ? new URLSearchParams(params).toString() : '';
    const response = await api.get(`/courses${query ? `?${query}` : ''}`);
    return response.data?.data && response.data?.totalPages !== undefined ? response.data.data : response.data;
  },
  getCourse: async (id: string) => {
    const response = await api.get(`/courses/${id}`);
    return response.data?.data && response.data?.totalPages !== undefined ? response.data.data : response.data;
  },
  enroll: async (courseId: string) => {
    const response = await api.post(`/courses/${courseId}/enroll`);
    return response.data?.data && response.data?.totalPages !== undefined ? response.data.data : response.data;
  },
  getMyLearning: async () => {
    const response = await api.get(`/courses/my-learning`);
    return response.data?.data && response.data?.totalPages !== undefined ? response.data.data : response.data;
  },
  createCourse: async (data: any) => {
    const response = await api.post(`/courses`, data);
    return response.data?.data && response.data?.totalPages !== undefined ? response.data.data : response.data;
  },
  updateCourse: async (id: string, data: any) => {
    const response = await api.patch(`/courses/${id}`, data);
    return response.data?.data && response.data?.totalPages !== undefined ? response.data.data : response.data;
  },
  createModule: async (courseId: string, data: any) => {
    const response = await api.post(`/courses/${courseId}/modules`, data);
    return response.data?.data && response.data?.totalPages !== undefined ? response.data.data : response.data;
  },
  createLesson: async (moduleId: string, data: any) => {
    const response = await api.post(`/courses/modules/${moduleId}/lessons`, data);
    return response.data?.data && response.data?.totalPages !== undefined ? response.data.data : response.data;
  },
  createAssessment: async (moduleId: string, data: any) => {
    const response = await api.post(`/courses/modules/${moduleId}/assessment`, data);
    return response.data?.data && response.data?.totalPages !== undefined ? response.data.data : response.data;
  },
  createQuestion: async (assessmentId: string, data: any) => {
    const response = await api.post(`/courses/assessments/${assessmentId}/questions`, data);
    return response.data?.data && response.data?.totalPages !== undefined ? response.data.data : response.data;
  }
};

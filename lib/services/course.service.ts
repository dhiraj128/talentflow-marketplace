import api from '../api';

export const courseService = {
  getCourses: async () => {
    const response = await api.get('/courses');
    return response.data;
  },
  getCourse: async (id: string) => {
    const response = await api.get(`/courses/${id}`);
    return response.data;
  },
  enroll: async (courseId: string, candidateId: string) => {
    const response = await api.post('/enrollments', { courseId, candidateId });
    return response.data;
  },
  getEnrollments: async (candidateId: string) => {
    const response = await api.get(`/enrollments?candidateId=${candidateId}`);
    return response.data;
  }
};

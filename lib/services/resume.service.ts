import api from '../api';

export const resumeService = {
  getResumes: async (candidateId: string) => {
    const response = await api.get(`/resumes?candidateId=${candidateId}`);
    return response.data?.data && response.data?.totalPages !== undefined ? response.data.data : response.data;
  },
  getResume: async (id: string) => {
    const response = await api.get(`/resumes/${id}`);
    return response.data?.data && response.data?.totalPages !== undefined ? response.data.data : response.data;
  },
  createResume: async (data: any) => {
    const response = await api.post('/resumes', data);
    return response.data?.data && response.data?.totalPages !== undefined ? response.data.data : response.data;
  },
  uploadResumeFile: async (file: File, onProgress?: (p: number) => void) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post('/file-upload/resume', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total && onProgress) {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(percentCompleted);
        }
      }
    });
    return response.data;
  },
  updateResume: async (id: string, data: any) => {
    const response = await api.patch(`/resumes/${id}`, data);
    return response.data?.data && response.data?.totalPages !== undefined ? response.data.data : response.data;
  },
  deleteResume: async (id: string) => {
    const response = await api.delete(`/resumes/${id}`);
    return response.data?.data && response.data?.totalPages !== undefined ? response.data.data : response.data;
  }
};

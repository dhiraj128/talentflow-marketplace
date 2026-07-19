import api from '../api';

export interface Interview {
  id: string;
  applicationId: string;
  employerId: string;
  candidateId: string;
  scheduledAt: string;
  duration: number;
  timezone: string;
  meetingProvider?: string;
  meetingUrl?: string;
  notes?: string;
  feedback?: string;
  status: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW';
  candidate?: {
    fullName: string;
    avatarUrl?: string;
    user: { email: string };
  };
  employer?: {
    companyName: string;
    logoUrl?: string;
    user: { email: string };
  };
  application?: {
    job: { title: string };
  };
}

export const interviewsService = {
  schedule: async (data: {
    applicationId: string;
    scheduledAt: string;
    duration?: number;
    timezone?: string;
    meetingProvider?: string;
    meetingUrl?: string;
    notes?: string;
  }) => {
    const res = await api.post('/interviews/schedule', data);
    return res.data;
  },

  getEmployerInterviews: async (): Promise<Interview[]> => {
    const res = await api.get('/interviews/employer');
    return res.data;
  },

  getCandidateInterviews: async (): Promise<Interview[]> => {
    const res = await api.get('/interviews/candidate');
    return res.data;
  },

  reschedule: async (id: string, data: { scheduledAt: string; duration?: number; meetingUrl?: string; notes?: string }) => {
    const res = await api.patch(`/interviews/${id}/reschedule`, data);
    return res.data;
  },

  cancel: async (id: string) => {
    const res = await api.patch(`/interviews/${id}/cancel`);
    return res.data;
  },

  complete: async (id: string, data: { feedback?: string }) => {
    const res = await api.patch(`/interviews/${id}/complete`, data);
    return res.data;
  },

  markNoShow: async (id: string) => {
    const res = await api.patch(`/interviews/${id}/no-show`);
    return res.data;
  },
};

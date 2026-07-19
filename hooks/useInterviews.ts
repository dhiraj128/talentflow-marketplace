import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { interviewsService } from '@/lib/services/interviews.service';
import { toast } from 'sonner';

export const useEmployerInterviews = () => {
  return useQuery({
    queryKey: ['interviews', 'employer'],
    queryFn: interviewsService.getEmployerInterviews,
  });
};

export const useCandidateInterviews = () => {
  return useQuery({
    queryKey: ['interviews', 'candidate'],
    queryFn: interviewsService.getCandidateInterviews,
  });
};

export const useScheduleInterview = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: interviewsService.schedule,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['interviews', 'employer'] });
      queryClient.invalidateQueries({ queryKey: ['applications'] });
      toast.success('Interview scheduled successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to schedule interview');
    },
  });
};

export const useRescheduleInterview = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => interviewsService.reschedule(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['interviews', 'employer'] });
      queryClient.invalidateQueries({ queryKey: ['interviews', 'candidate'] });
      toast.success('Interview rescheduled successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to reschedule interview');
    },
  });
};

export const useCancelInterview = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: interviewsService.cancel,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['interviews', 'employer'] });
      queryClient.invalidateQueries({ queryKey: ['interviews', 'candidate'] });
      toast.success('Interview cancelled successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to cancel interview');
    },
  });
};

export const useCompleteInterview = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, feedback }: { id: string; feedback?: string }) => interviewsService.complete(id, { feedback }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['interviews', 'employer'] });
      toast.success('Interview completed');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to mark interview as completed');
    },
  });
};

export const useMarkNoShowInterview = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: interviewsService.markNoShow,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['interviews', 'employer'] });
      toast.success('Candidate marked as no-show');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to mark candidate as no-show');
    },
  });
};

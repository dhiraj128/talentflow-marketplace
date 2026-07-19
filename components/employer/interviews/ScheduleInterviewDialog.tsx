"use client";
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useScheduleInterview } from '@/hooks/useInterviews';
import { useQuery } from '@tanstack/react-query';
import { applicationService } from '@/lib/services/application.service';

export function ScheduleInterviewDialog({ children }: { children?: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [applicationId, setApplicationId] = useState('');
  const [scheduledAt, setScheduledAt] = useState('');
  const [duration, setDuration] = useState('60');
  const [meetingProvider, setMeetingProvider] = useState('Google Meet');
  const [meetingUrl, setMeetingUrl] = useState('');
  
  const scheduleMutation = useScheduleInterview();

  const { data: applications } = useQuery({
    queryKey: ['applications', 'employer'],
    queryFn: async () => {
      return applicationService.getEmployerApplications ? applicationService.getEmployerApplications() : [];
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    scheduleMutation.mutate({
      applicationId,
      scheduledAt: new Date(scheduledAt).toISOString(),
      duration: parseInt(duration),
      meetingProvider,
      meetingUrl
    }, {
      onSuccess: () => {
        setOpen(false);
        setApplicationId('');
        setScheduledAt('');
        setMeetingUrl('');
      }
    });
  };

  const eligibleApplications = applications?.filter((app: any) => ['PENDING', 'REVIEWING', 'SHORTLISTED', 'INTERVIEWING'].includes(app.status)) || [];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        {children || <Button type="button">Schedule Interview</Button>}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Schedule Interview</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Candidate Application</label>
            <Select value={applicationId} onValueChange={(val) => setApplicationId(val || '')} required>
              <SelectTrigger>
                <SelectValue placeholder="Select candidate" />
              </SelectTrigger>
              <SelectContent>
                {eligibleApplications.map((app: any) => (
                  <SelectItem key={app.id} value={app.id}>
                    {app.candidate?.user?.email} - {app.job?.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Date & Time</label>
            <Input type="datetime-local" required value={scheduledAt} onChange={e => setScheduledAt(e.target.value)} />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Duration (minutes)</label>
            <Input type="number" min="15" required value={duration} onChange={e => setDuration(e.target.value)} />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Meeting Provider</label>
            <Select value={meetingProvider} onValueChange={(val) => setMeetingProvider(val || '')}>
              <SelectTrigger>
                <SelectValue placeholder="Select provider" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Google Meet">Google Meet</SelectItem>
                <SelectItem value="Zoom">Zoom</SelectItem>
                <SelectItem value="Microsoft Teams">Microsoft Teams</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Meeting URL</label>
            <Input type="url" placeholder="https://..." value={meetingUrl} onChange={e => setMeetingUrl(e.target.value)} />
          </div>

          <div className="pt-4 flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={scheduleMutation.isPending}>
              {scheduleMutation.isPending ? "Scheduling..." : "Schedule"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

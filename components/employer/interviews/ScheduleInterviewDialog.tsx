"use client";
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useScheduleInterview } from "@/hooks/useInterviews";
import { useQuery } from "@tanstack/react-query";
import { applicationService } from "@/lib/services/application.service";
import { toast } from "sonner";

export function ScheduleInterviewDialog({ children, defaultApplicationId }: { children?: React.ReactNode; defaultApplicationId?: string }) {
  const [open, setOpen] = useState(false);
  const [applicationId, setApplicationId] = useState(defaultApplicationId || "");
  const [scheduledAt, setScheduledAt] = useState("");
  const [type, setType] = useState("VIDEO");
  const [duration, setDuration] = useState("60");
  const [meetingProvider, setMeetingProvider] = useState("Google Meet");
  const [meetingUrl, setMeetingUrl] = useState("");
  const [location, setLocation] = useState("");
  const [instructions, setInstructions] = useState("");

  const scheduleMutation = useScheduleInterview();

  const { data: applications } = useQuery({
    queryKey: ["applications", "employer"],
    queryFn: async () => {
      return applicationService.getEmployerApplications ? applicationService.getEmployerApplications() : [];
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!scheduledAt) {
      toast.error("Please select date and time");
      return;
    }
    const targetAppId = applicationId || defaultApplicationId;
    if (!targetAppId) {
      toast.error("Please select a candidate application");
      return;
    }

    scheduleMutation.mutate(
      {
        applicationId: targetAppId,
        scheduledAt: new Date(scheduledAt).toISOString(),
        type,
        duration: parseInt(duration),
        meetingProvider,
        meetingUrl: meetingUrl || undefined,
        location: location || undefined,
        instructions: instructions || undefined,
      },
      {
        onSuccess: () => {
          toast.success("Interview scheduled successfully!");
          setOpen(false);
          setScheduledAt("");
          setMeetingUrl("");
          setLocation("");
          setInstructions("");
        },
        onError: (err: any) => {
          toast.error(err?.response?.data?.message || "Failed to schedule interview");
        },
      }
    );
  };

  const eligibleApplications = applications?.filter((app: any) => ["PENDING", "REVIEWING", "SHORTLISTED", "INTERVIEWING"].includes(app.status)) || [];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        {children ? (
          <div>{children}</div>
        ) : (
          <Button size="sm" variant="outline">
            Schedule Interview
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Schedule Candidate Interview</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2 max-h-[75vh] overflow-y-auto pr-1">
          {!defaultApplicationId && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Candidate Application *</label>
              <Select value={applicationId} onValueChange={(val) => setApplicationId(val || "")} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select candidate application" />
                </SelectTrigger>
                <SelectContent>
                  {eligibleApplications.map((app: any) => (
                    <SelectItem key={app.id} value={app.id}>
                      {app.candidate?.fullName || app.candidate?.user?.email} — {app.job?.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <label className="text-sm font-medium">Date & Time *</label>
              <Input type="datetime-local" required value={scheduledAt} onChange={(e) => setScheduledAt(e.target.value)} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Interview Type</label>
              <Select value={type} onValueChange={(val) => setType(val || "VIDEO")}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="VIDEO">Video Call</SelectItem>
                  <SelectItem value="PHONE">Phone Screen</SelectItem>
                  <SelectItem value="TECHNICAL">Technical Interview</SelectItem>
                  <SelectItem value="HR">HR Interview</SelectItem>
                  <SelectItem value="FINAL">Final Interview</SelectItem>
                  <SelectItem value="IN_PERSON">In-Person</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <label className="text-sm font-medium">Duration (minutes)</label>
              <Input type="number" min="15" required value={duration} onChange={(e) => setDuration(e.target.value)} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Meeting Provider</label>
              <Select value={meetingProvider} onValueChange={(val) => setMeetingProvider(val || "Google Meet")}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Google Meet">Google Meet</SelectItem>
                  <SelectItem value="Zoom">Zoom</SelectItem>
                  <SelectItem value="Microsoft Teams">Microsoft Teams</SelectItem>
                  <SelectItem value="Phone Call">Phone Call</SelectItem>
                  <SelectItem value="In Person">In Person</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Meeting URL / Link</label>
            <Input type="url" placeholder="https://..." value={meetingUrl} onChange={(e) => setMeetingUrl(e.target.value)} />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Physical Location (if In-Person)</label>
            <Input placeholder="e.g. Office Suite 400, New York, NY" value={location} onChange={(e) => setLocation(e.target.value)} />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Candidate Preparation Instructions</label>
            <Textarea placeholder="Please bring your portfolio and prepare for live coding..." value={instructions} onChange={(e) => setInstructions(e.target.value)} rows={2} />
          </div>

          <div className="pt-4 flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={scheduleMutation.isPending}>
              {scheduleMutation.isPending ? "Scheduling..." : "Schedule Interview"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

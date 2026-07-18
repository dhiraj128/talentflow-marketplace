"use client";

import React from "react";
import { PageContainer } from "@/components/shared/PageContainer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { projectRequestService } from "@/lib/services/project-request.service";
import { toast } from "sonner";
import { Bell } from "lucide-react";

export default function FreelancerDashboardPage() {
  const queryClient = useQueryClient();

  const { data: requests, isLoading } = useQuery({
    queryKey: ['freelancerRequests'],
    queryFn: () => projectRequestService.getFreelancerRequests(),
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string, status: 'ACCEPTED' | 'REJECTED' }) => projectRequestService.updateStatus(id, status),
    onSuccess: () => {
      toast.success("Request updated!");
      queryClient.invalidateQueries({ queryKey: ['freelancerRequests'] });
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Failed to update request");
    }
  });

  if (isLoading) return <PageContainer><div className="p-12 text-center text-muted-foreground animate-pulse">Loading dashboard...</div></PageContainer>;

  const pendingRequests = requests?.filter((r: any) => r.status === 'PENDING') || [];
  const activeRequests = requests?.filter((r: any) => r.status === 'ACCEPTED') || [];
  const completedRequests = requests?.filter((r: any) => r.status === 'COMPLETED') || [];

  return (
    <PageContainer>
      <div className="max-w-5xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold">Freelancer Dashboard</h1>
        
        {/* Notification Banner for Pending Requests */}
        {pendingRequests.length > 0 && (
          <div className="bg-primary/10 border border-primary/20 text-primary p-4 rounded-xl flex items-center gap-3">
            <Bell className="w-5 h-5" />
            <span className="font-semibold">{pendingRequests.length} new project request(s) received — Please review them below.</span>
          </div>
        )}

        {/* Pending Requests */}
        <Card>
          <CardHeader>
            <CardTitle>Incoming Project Requests</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {pendingRequests.length === 0 ? (
              <p className="text-muted-foreground">No pending requests at the moment.</p>
            ) : (
              pendingRequests.map((req: any) => (
                <div key={req.id} className="border p-4 rounded-xl bg-muted/30">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-lg">{req.title}</h3>
                      <p className="text-sm text-muted-foreground mb-2">From: {req.employer?.companyName || req.employer?.fullName}</p>
                      <Badge variant="outline" className="mb-4 bg-background">Budget: ${req.budget}</Badge>
                      <p className="whitespace-pre-wrap text-sm text-muted-foreground">{req.description}</p>
                    </div>
                    <div className="flex flex-col gap-2 min-w-[120px]">
                      <Button size="sm" onClick={() => updateStatusMutation.mutate({ id: req.id, status: 'ACCEPTED' })}>Accept</Button>
                      <Button size="sm" variant="outline" onClick={() => updateStatusMutation.mutate({ id: req.id, status: 'REJECTED' })}>Reject</Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Active Projects */}
        <Card>
          <CardHeader>
            <CardTitle>Active Engagements</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {activeRequests.length === 0 ? (
              <p className="text-muted-foreground">No active projects.</p>
            ) : (
              activeRequests.map((req: any) => (
                <div key={req.id} className="border p-4 rounded-xl bg-muted/30">
                  <h3 className="font-bold text-lg">{req.title}</h3>
                  <p className="text-sm text-muted-foreground mb-2">Client: {req.employer?.companyName || req.employer?.fullName}</p>
                  <Badge variant="secondary" className="bg-blue-100 text-blue-700">ACCEPTED / IN PROGRESS</Badge>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Completed Projects */}
        <Card>
          <CardHeader>
            <CardTitle>Completed Projects</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {completedRequests.length === 0 ? (
              <p className="text-muted-foreground">No completed projects yet.</p>
            ) : (
              completedRequests.map((req: any) => (
                <div key={req.id} className="border p-4 rounded-xl bg-muted/30">
                  <h3 className="font-bold text-lg">{req.title}</h3>
                  <p className="text-sm text-muted-foreground mb-2">Client: {req.employer?.companyName || req.employer?.fullName}</p>
                  <Badge variant="secondary" className="bg-green-100 text-green-700">COMPLETED</Badge>
                </div>
              ))
            )}
          </CardContent>
        </Card>

      </div>
    </PageContainer>
  );
}

"use client";
import React, { useEffect, useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { PageContainer } from "@/components/shared/PageContainer";
import { StatsGrid } from "@/components/shared/StatsGrid";
import { MetricCard } from "@/components/shared/MetricCard";
import { DataTable } from "@/components/shared/DataTable";
import { Users, Briefcase, CheckCircle, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { analyticsService } from "@/lib/services/analytics.service";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";

import { projectRequestService } from "@/lib/services/project-request.service";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function EmployerDashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Review state
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [reviewData, setReviewData] = useState({ requestId: '', rating: '5', text: '' });

  useEffect(() => {
    if (!loading && !user) {
      router.push("/sign-in");
    } else if (user) {
      analyticsService.getEmployerDashboard().then(res => {
        setData(res);
        setIsLoading(false);
      }).catch(err => {
        console.error("Failed to load dashboard data", err);
        setIsLoading(false);
      });
    }
  }, [user, loading, router]);

  const { data: requests } = useQuery({
    queryKey: ['employerRequests'],
    queryFn: () => projectRequestService.getEmployerRequests(),
    enabled: !!user,
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string, status: 'COMPLETED' }) => projectRequestService.updateStatus(id, status),
    onSuccess: () => {
      toast.success("Project marked as COMPLETED!");
      queryClient.invalidateQueries({ queryKey: ['employerRequests'] });
    },
    onError: (err: any) => toast.error(err?.response?.data?.message || "Failed to update project status")
  });

  const reviewMutation = useMutation({
    mutationFn: () => projectRequestService.createReview(reviewData.requestId, { rating: parseInt(reviewData.rating), text: reviewData.text }),
    onSuccess: () => {
      toast.success("Review submitted successfully!");
      setIsReviewOpen(false);
      queryClient.invalidateQueries({ queryKey: ['employerRequests'] });
    },
    onError: (err: any) => toast.error(err?.response?.data?.message || "Failed to submit review")
  });

  if (loading || !user || isLoading) return null;

  const columns = [
    { accessorKey: "applicant", header: "Applicant" },
    { accessorKey: "job", header: "Job Role" },
    { accessorKey: "date", header: "Applied Date" },
    { accessorKey: "status", header: "Status" },
  ];

  const tableData = data?.recentApplications?.map((app: any) => ({
    id: app.id,
    applicant: app.candidate?.fullName || "Unknown",
    job: app.job?.title || "Unknown",
    date: new Date(app.appliedAt).toLocaleDateString(),
    status: app.status
  })) || [];

  return (
    <PageContainer>
      <PageHeader title="Dashboard" description="Overview of your recruitment activity" actionLabel="Post Job" />
      <StatsGrid>
        <MetricCard title="Total Jobs" value={data?.stats?.totalJobs?.toString() || "0"} icon={<Briefcase />} />
        <MetricCard title="Active (Published)" value={data?.stats?.activeJobs?.toString() || "0"} icon={<CheckCircle className="text-green-500" />} />
        <MetricCard title="Pending (Draft)" value={data?.stats?.draftJobs?.toString() || "0"} icon={<Clock className="text-amber-500" />} />
        <MetricCard title="Total Applications" value={data?.stats?.totalApplications?.toString() || "0"} icon={<Users />} />
        <MetricCard title="Shortlisted" value={data?.stats?.shortlisted?.toString() || "0"} icon={<CheckCircle />} />
        <MetricCard title="Interviews" value={data?.stats?.interviewsScheduled?.toString() || "0"} icon={<Users />} />
        <MetricCard title="Offers Made" value={data?.stats?.hiredCandidates?.toString() || "0"} icon={<Briefcase className="text-blue-500" />} />
      </StatsGrid>
      <Card>
        <CardHeader>
          <CardTitle>Recent Applications</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={tableData} searchKey="applicant" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Freelancer Project Requests</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {!requests || requests.length === 0 ? (
            <p className="text-muted-foreground">No project requests sent yet.</p>
          ) : (
            requests.map((req: any) => (
              <div key={req.id} className="border p-4 rounded-xl flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-lg">{req.title}</h3>
                  <p className="text-sm text-muted-foreground mb-2">Freelancer: {req.freelancer?.fullName}</p>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">${req.budget}</Badge>
                    <Badge className={req.status === 'COMPLETED' ? 'bg-green-500' : req.status === 'ACCEPTED' ? 'bg-blue-500' : req.status === 'REJECTED' ? 'bg-red-500' : 'bg-yellow-500'}>
                      {req.status}
                    </Badge>
                  </div>
                </div>
                <div className="flex gap-2">
                  {req.status === 'ACCEPTED' && (
                    <Button onClick={() => statusMutation.mutate({ id: req.id, status: 'COMPLETED' })}>Mark Completed</Button>
                  )}
                  {req.status === 'COMPLETED' && (
                    <Dialog open={isReviewOpen && reviewData.requestId === req.id} onOpenChange={(open) => {
                      setIsReviewOpen(open);
                      if (open) setReviewData({ requestId: req.id, rating: '5', text: '' });
                    }}>
                      <DialogTrigger>
                        <Button variant="outline">Leave Review</Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader><DialogTitle>Review Freelancer</DialogTitle></DialogHeader>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label>Rating (1-5)</Label>
                            <Input type="number" min="1" max="5" value={reviewData.rating} onChange={e => setReviewData(d => ({ ...d, rating: e.target.value }))} />
                          </div>
                          <div className="space-y-2">
                            <Label>Review Comments (Optional)</Label>
                            <Textarea value={reviewData.text} onChange={e => setReviewData(d => ({ ...d, text: e.target.value }))} />
                          </div>
                          <Button className="w-full" onClick={() => reviewMutation.mutate()} disabled={reviewMutation.isPending}>
                            Submit Review
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  )}
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </PageContainer>
  );
}

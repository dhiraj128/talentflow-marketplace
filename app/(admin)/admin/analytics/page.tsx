"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { MetricCard } from "@/components/shared/MetricCard";
import { StatsGrid } from "@/components/shared/StatsGrid";
import { Users, DollarSign, Briefcase, FileText } from "lucide-react";
import { analyticsService } from "@/lib/services/analytics.service";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminAnalyticsPage() {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    analyticsService.getAdminDashboard()
      .then((res) => {
        setData(res);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch admin analytics", err);
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto p-8 space-y-8">
        <Skeleton className="h-12 w-64" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Skeleton className="h-28 w-full" />
          <Skeleton className="h-28 w-full" />
          <Skeleton className="h-28 w-full" />
          <Skeleton className="h-28 w-full" />
        </div>
      </div>
    );
  }

  const totalUsers = data?.stats?.totalUsers ?? 0;
  const activeJobs = data?.stats?.totalJobs ?? 0;
  const totalApplications = data?.stats?.totalApplications ?? 0;
  const totalRevenue = data?.stats?.totalRevenue ?? 0;

  return (
    <div className="max-w-7xl mx-auto p-8 space-y-8">
      <PageHeader title="Platform Analytics" description="Deep dive into system metrics and growth" />
      <StatsGrid columns={4}>
        <MetricCard title="Total Platform Users" value={totalUsers.toLocaleString()} icon={<Users className="w-4 h-4" />} />
        <MetricCard title="Total Jobs Posted" value={activeJobs.toLocaleString()} icon={<Briefcase className="w-4 h-4" />} />
        <MetricCard title="Total Applications" value={totalApplications.toLocaleString()} icon={<FileText className="w-4 h-4" />} />
        <MetricCard title="Gross Platform Volume" value={`$${totalRevenue.toLocaleString()}`} icon={<DollarSign className="w-4 h-4" />} />
      </StatsGrid>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-card border p-6 rounded-xl min-h-64 flex flex-col justify-center items-center text-muted-foreground text-center">
          <p className="font-semibold text-foreground mb-1">User Growth Analytics</p>
          <p className="text-sm max-w-xs">Tracking real-time user registrations across Candidates, Employers, Freelancers, and Trainers.</p>
        </div>
        <div className="bg-card border p-6 rounded-xl min-h-64 flex flex-col justify-center items-center text-muted-foreground text-center">
          <p className="font-semibold text-foreground mb-1">Platform Activity</p>
          <p className="text-sm max-w-xs">Tracking job posts, applications, and contract completions.</p>
        </div>
      </div>
    </div>
  );
}

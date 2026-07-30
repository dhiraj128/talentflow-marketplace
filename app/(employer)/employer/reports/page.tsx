"use client";

import React, { useEffect, useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatsGrid } from "@/components/shared/StatsGrid";
import { MetricCard } from "@/components/shared/MetricCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase, Users, CheckCircle, FileText } from "lucide-react";
import { analyticsService } from "@/lib/services/analytics.service";
import { Skeleton } from "@/components/ui/skeleton";

export default function ReportsPage() {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    analyticsService.getEmployerDashboard()
      .then((res) => {
        setData(res);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch employer reports data", err);
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

  const activeJobs = data?.stats?.activeJobs ?? 0;
  const totalApplications = data?.stats?.totalApplications ?? 0;
  const hiresCount = data?.stats?.hiresCount ?? 0;
  const interviewsCount = data?.stats?.interviewsScheduled ?? 0;

  return (
    <div className="max-w-7xl mx-auto p-8 space-y-8">
      <PageHeader title="Reports & Analytics" description="Insights into your hiring performance." />
      
      <StatsGrid>
        <MetricCard title="Active Job Posts" value={activeJobs.toString()} icon={<Briefcase className="w-4 h-4" />} />
        <MetricCard title="Total Applications" value={totalApplications.toString()} icon={<FileText className="w-4 h-4" />} />
        <MetricCard title="Interviews Scheduled" value={interviewsCount.toString()} icon={<Users className="w-4 h-4" />} />
        <MetricCard title="Total Hires" value={hiresCount.toString()} icon={<CheckCircle className="w-4 h-4 text-green-500" />} />
      </StatsGrid>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <Card className="min-h-[300px] flex flex-col">
          <CardHeader>
            <CardTitle>Application Pipeline Summary</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col items-center justify-center text-muted-foreground text-center p-6">
            {totalApplications === 0 ? (
              <p className="text-sm">No candidates have applied to your active job listings yet.</p>
            ) : (
              <div className="w-full space-y-3 text-left text-foreground">
                <div className="flex justify-between text-sm">
                  <span>Total Received</span>
                  <span className="font-semibold">{totalApplications}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>In Review / Interviewing</span>
                  <span className="font-semibold">{interviewsCount}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Hired</span>
                  <span className="font-semibold">{hiresCount}</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="min-h-[300px] flex flex-col">
          <CardHeader>
            <CardTitle>Hiring Metrics</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col items-center justify-center text-muted-foreground text-center p-6">
            <p className="text-sm">
              Detailed time-to-hire and cost-per-hire analytics will populate automatically as job listings progress through full candidate hiring cycles.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

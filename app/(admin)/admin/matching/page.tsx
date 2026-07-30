"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { MetricCard } from "@/components/shared/MetricCard";
import { StatsGrid } from "@/components/shared/StatsGrid";
import { Shuffle, Zap, Target } from "lucide-react";
import { analyticsService } from "@/lib/services/analytics.service";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminMatchingPage() {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    analyticsService.getAdminDashboard()
      .then((res) => {
        setData(res);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch admin matching info", err);
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto p-8 space-y-8">
        <Skeleton className="h-12 w-64" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Skeleton className="h-28 w-full" />
          <Skeleton className="h-28 w-full" />
          <Skeleton className="h-28 w-full" />
        </div>
      </div>
    );
  }

  const activeJobs = data?.stats?.totalJobs ?? 0;
  const activeCandidates = data?.stats?.totalCandidates ?? 0;

  return (
    <div className="max-w-7xl mx-auto p-8 space-y-8">
      <PageHeader title="Matching Engine" description="Configure and monitor the AI matching algorithm" />
      <StatsGrid columns={3}>
        <MetricCard title="Active Jobs Indexed" value={activeJobs.toLocaleString()} icon={<Shuffle className="w-4 h-4" />} />
        <MetricCard title="Candidates Indexed" value={activeCandidates.toLocaleString()} icon={<Target className="w-4 h-4" />} />
        <MetricCard title="AI Engine Status" value="Operational" icon={<Zap className="w-4 h-4 text-green-500" />} />
      </StatsGrid>
      
      <div className="bg-card text-card-foreground p-6 rounded-xl border">
        <h3 className="text-lg font-semibold mb-4">Algorithm Weight Tuning</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Skill Overlap Weight (%)</label>
            <input type="range" className="w-full" defaultValue={60} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Experience & Title Weight (%)</label>
            <input type="range" className="w-full" defaultValue={30} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Location & Work Mode Weight (%)</label>
            <input type="range" className="w-full" defaultValue={10} />
          </div>
        </div>
      </div>
    </div>
  );
}

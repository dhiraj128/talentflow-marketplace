"use client";

import { PageHeader } from "@/components/shared/PageHeader";
import { MetricCard } from "@/components/shared/MetricCard";
import { StatsGrid } from "@/components/shared/StatsGrid";
import { TrendingUp, Users, DollarSign, Activity } from "lucide-react";

export default function AdminAnalyticsPage() {
  return (
    <div className="max-w-7xl mx-auto p-8 space-y-8">
      <PageHeader title="Platform Analytics" description="Deep dive into system metrics and growth" />
      <StatsGrid columns={4}>
        <MetricCard title="Total Revenue" value="$45,231" icon={<DollarSign className="w-4 h-4" />} trend="up" trendValue="+14%" />
        <MetricCard title="Active Users" value="8,942" icon={<Users className="w-4 h-4" />} trend="up" trendValue="+3%" />
        <MetricCard title="Engagement Rate" value="64%" icon={<Activity className="w-4 h-4" />} trend="neutral" trendValue="0%" />
        <MetricCard title="Growth" value="+22%" icon={<TrendingUp className="w-4 h-4" />} trend="up" trendValue="+2%" />
      </StatsGrid>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-card border p-6 rounded-xl h-64 flex items-center justify-center text-muted-foreground">
          [Revenue Chart Placeholder]
        </div>
        <div className="bg-card border p-6 rounded-xl h-64 flex items-center justify-center text-muted-foreground">
          [User Registration Chart Placeholder]
        </div>
      </div>
    </div>
  );
}

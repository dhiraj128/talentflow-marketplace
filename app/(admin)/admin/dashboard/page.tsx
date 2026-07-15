"use client";

import { PageHeader } from "@/components/shared/PageHeader";
import { MetricCard } from "@/components/shared/MetricCard";
import { StatsGrid } from "@/components/shared/StatsGrid";
import { Users, Briefcase, GraduationCap, Activity } from "lucide-react";

export default function AdminDashboardPage() {
  return (
    <div className="max-w-7xl mx-auto p-8 space-y-8">
      <PageHeader 
        title="Admin Dashboard" 
        description="System overview and key metrics"
      />
      <StatsGrid columns={4}>
        <MetricCard title="Total Users" value="12,345" icon={<Users className="w-4 h-4" />} trend="up" trendValue="+12%" />
        <MetricCard title="Active Jobs" value="1,234" icon={<Briefcase className="w-4 h-4" />} trend="up" trendValue="+5%" />
        <MetricCard title="Courses" value="842" icon={<GraduationCap className="w-4 h-4" />} trend="up" trendValue="+2%" />
        <MetricCard title="System Load" value="24%" icon={<Activity className="w-4 h-4" />} trend="neutral" trendValue="Stable" />
      </StatsGrid>
    </div>
  );
}

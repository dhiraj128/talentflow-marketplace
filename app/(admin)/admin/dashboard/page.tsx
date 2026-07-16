"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { MetricCard } from "@/components/shared/MetricCard";
import { StatsGrid } from "@/components/shared/StatsGrid";
import { Users, Briefcase, GraduationCap, Activity } from "lucide-react";
import { analyticsService } from "@/lib/services/analytics.service";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";

export default function AdminDashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/sign-in");
    } else if (user) {
      analyticsService.getAdminDashboard().then(res => {
        setData(res);
        setIsLoading(false);
      }).catch(err => {
        console.error("Failed to load admin dashboard", err);
        setIsLoading(false);
      });
    }
  }, [user, loading, router]);

  if (loading || !user || isLoading) return null;

  return (
    <div className="max-w-7xl mx-auto p-8 space-y-8">
      <PageHeader 
        title="Admin Dashboard" 
        description="System overview and key metrics"
      />
      <StatsGrid columns={4}>
        <MetricCard title="Total Users" value={data?.totalUsers?.toLocaleString() || "0"} icon={<Users className="w-4 h-4" />} trend="up" trendValue="Live" />
        <MetricCard title="Active Jobs" value={data?.totalJobs?.toLocaleString() || "0"} icon={<Briefcase className="w-4 h-4" />} trend="up" trendValue="Live" />
        <MetricCard title="Courses" value={data?.totalCourses?.toLocaleString() || "0"} icon={<GraduationCap className="w-4 h-4" />} trend="up" trendValue="Live" />
        <MetricCard title="Total Applications" value={data?.totalApplications?.toLocaleString() || "0"} icon={<Activity className="w-4 h-4" />} trend="neutral" trendValue="Live" />
      </StatsGrid>
    </div>
  );
}

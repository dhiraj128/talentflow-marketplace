"use client";

import React, { useEffect, useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatsGrid } from "@/components/shared/StatsGrid";
import { MetricCard } from "@/components/shared/MetricCard";
import { Briefcase, DollarSign, Star, Clock } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { analyticsService } from "@/lib/services/analytics.service";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/sign-in");
    } else if (user) {
      analyticsService.getFreelancerDashboard().then(res => {
        setData(res);
        setIsLoading(false);
      }).catch(err => {
        console.error("Failed to load dashboard data", err);
        setIsLoading(false);
      });
    }
  }, [user, loading, router]);

  if (loading || !user || isLoading) return null;

  return (
    <div className="max-w-7xl mx-auto p-8 space-y-8">
      <PageHeader 
        title="Dashboard" 
        description="Welcome back. Here's an overview of your freelance business."
        actionLabel="Find Work"
      />

      <StatsGrid columns={4}>
        <MetricCard title="Total Earnings" value="$0" icon={<DollarSign className="w-4 h-4" />} trend="neutral" trendValue="No earnings yet" />
        <MetricCard title="Active Projects" value={data?.stats?.activeApplications?.toString() || "0"} icon={<Briefcase className="w-4 h-4" />} />
        <MetricCard title="Proposals Sent" value={data?.stats?.activeApplications?.toString() || "0"} icon={<Clock className="w-4 h-4" />} trend="up" trendValue="+0 this week" />
        <MetricCard title="Success Rate" value="0%" icon={<Star className="w-4 h-4" />} trend="neutral" trendValue="New" />
      </StatsGrid>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Recent Applications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data?.recentApplications?.length > 0 ? data.recentApplications.map((app: any) => (
                  <div key={app.id} className="flex justify-between items-center border-b pb-4">
                    <div>
                      <p className="font-medium">{app.job?.title || "Unknown Job"}</p>
                      <p className="text-sm text-muted-foreground">Submitted on {new Date(app.appliedAt).toLocaleDateString()}</p>
                    </div>
                    <div className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">{app.status}</div>
                  </div>
                )) : (
                  <p className="text-muted-foreground text-sm">No recent applications.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Profile Completion</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full" style={{ width: `${data?.metrics?.profileCompletion || 0}%` }}></div>
                </div>
                <p className="text-sm text-muted-foreground">{data?.metrics?.profileCompletion || 0}% Complete. Add portfolio items to reach 100%.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

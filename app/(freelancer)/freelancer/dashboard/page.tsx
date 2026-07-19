"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { PageContainer } from "@/components/shared/PageContainer";
import { analyticsService } from "@/lib/services/analytics.service";

// Dashboard Components
import { FreelancerWelcomeHeader } from "@/features/freelancer/dashboard/FreelancerWelcomeHeader";
import { BidNotificationBanner } from "@/features/freelancer/dashboard/BidNotificationBanner";
import { FreelancerStatistics } from "@/features/freelancer/dashboard/FreelancerStatistics";
import { ProjectInvitations } from "@/features/freelancer/dashboard/ProjectInvitations";
import { RecentProjects } from "@/features/freelancer/dashboard/RecentProjects";
import { EarningsOverview } from "@/features/freelancer/dashboard/EarningsOverview";
import { ActivityFeed } from "@/features/freelancer/dashboard/ActivityFeed";
import { DashboardSkeleton } from "@/features/freelancer/dashboard/DashboardSkeleton";
import { BidCardProps } from "@/features/freelancer/shared/BidCard";

export default function FreelancerDashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      const res = await analyticsService.getFreelancerDashboard();
      setData(res);
    } catch (error) {
      console.error("Failed to load freelancer dashboard", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!loading && !user) {
      router.push("/sign-in");
    } else if (user) {
      fetchDashboardData();
    }
  }, [user, loading, router]);

  if (loading || !user || isLoading) {
    return <DashboardSkeleton />;
  }

  const stats = {
    activeServices: data?.stats?.activeServices ?? 0,
    activeProjects: data?.stats?.activeProjects ?? 0,
    pendingBids: data?.stats?.pendingBids ?? 0,
    completedProjects: data?.stats?.completedProjects ?? 0,
    earnings: data?.stats?.earnings ?? 0,
    rating: data?.stats?.rating ?? 0,
    profileCompletion: data?.stats?.profileCompletion ?? 0,
    totalReviews: data?.stats?.totalReviews ?? 0,
  };

  const bids = data?.invitations?.map((inv: any) => ({
    id: inv.id,
    employerName: inv.employer?.companyName || "Unknown Client",
    projectTitle: inv.title,
    budget: `$${inv.budget}`,
    deadline: "TBD",
    status: inv.status,
    message: inv.description,
  })) || [];

  const projects = data?.projects?.map((proj: any) => ({
    id: proj.id,
    title: proj.title,
    employerName: proj.employer?.companyName || "Unknown Client",
    status: proj.status,
    progress: proj.status === 'COMPLETED' ? 100 : (proj.status === 'ACCEPTED' ? 50 : 0),
    dueDate: new Date(proj.updatedAt).toLocaleDateString(),
    amount: `$${proj.budget}`
  })) || [];

  const earningsData = [
    { name: 'Current', amount: stats.earnings }
  ];

  const activities = data?.recentActivity || [];

  return (
    <PageContainer>
      <div className="space-y-8 pb-10">
        <FreelancerWelcomeHeader user={user} />
        
        {stats.pendingBids > 0 && (
          <BidNotificationBanner count={stats.pendingBids} />
        )}
        
        <FreelancerStatistics stats={stats} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-8">
            <ProjectInvitations bids={bids} onActionComplete={fetchDashboardData} />
            <RecentProjects projects={projects} />
            <EarningsOverview data={earningsData} />
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            <ActivityFeed activities={activities} />
          </div>
          
        </div>
      </div>
    </PageContainer>
  );
}

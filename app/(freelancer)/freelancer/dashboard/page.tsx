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

  useEffect(() => {
    if (!loading && !user) {
      router.push("/sign-in");
    } else if (user) {
      // Typically, fetch freelancer dashboard data here
      // For now, we mock to ensure UI completeness
      setTimeout(() => {
        setData({ success: true });
        setIsLoading(false);
      }, 500);
    }
  }, [user, loading, router]);

  if (loading || !user || isLoading) {
    return <DashboardSkeleton />;
  }

  // MOCK DATA TRANSFORMATIONS

  const stats = {
    activeServices: 3,
    activeProjects: 2,
    pendingBids: 2,
    completedProjects: 15,
    earnings: 4500,
    rating: 4.8,
    profileCompletion: 95
  };

  const bids: BidCardProps[] = [
    {
      id: "bid-1",
      employerName: "TechCorp Inc.",
      projectTitle: "Frontend Rebuild - React & Tailwind",
      budget: "$2,000",
      deadline: "2 weeks",
      status: "PENDING",
      message: "We loved your portfolio and would like you to rebuild our landing page.",
    },
    {
      id: "bid-2",
      employerName: "DesignFlow Agency",
      projectTitle: "Figma to Next.js Conversion",
      budget: "$850",
      deadline: "1 week",
      status: "PENDING",
    }
  ];

  const projects = [
    {
      id: "proj-1",
      title: "Full-Stack Dashboard Setup",
      employerName: "Acme Corp",
      status: "ACTIVE" as any,
      progress: 65,
      dueDate: "Aug 15, 2026",
      amount: "$3,500"
    },
    {
      id: "proj-2",
      title: "API Integration & Testing",
      employerName: "Stark Industries",
      status: "ACTIVE" as any,
      progress: 15,
      dueDate: "Sep 01, 2026",
      amount: "$1,200"
    }
  ];

  const earningsData = [
    { name: 'Jan', amount: 800 },
    { name: 'Feb', amount: 1200 },
    { name: 'Mar', amount: 900 },
    { name: 'Apr', amount: 1500 },
    { name: 'May', amount: 2100 },
    { name: 'Jun', amount: 1800 },
    { name: 'Jul', amount: 2400 },
  ];

  const activities = [
    { id: "a-1", type: "BID_ACCEPTED", title: "TechCorp accepted your bid for 'Frontend Rebuild'", timestamp: "2 hours ago" },
    { id: "a-2", type: "PAYMENT_RECEIVED", title: "Received $800 from Stark Industries", timestamp: "1 day ago" },
    { id: "a-3", type: "NEW_REVIEW", title: "Acme Corp left a 5-star review", timestamp: "3 days ago" }
  ] as any[];

  return (
    <PageContainer>
      <div className="space-y-8 pb-10">
        <FreelancerWelcomeHeader user={user} />
        
        <BidNotificationBanner count={bids.filter(b => b.status === "PENDING").length} />
        
        <FreelancerStatistics stats={stats} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-8">
            <ProjectInvitations bids={bids} />
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

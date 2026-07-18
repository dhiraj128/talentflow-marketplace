"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { PageContainer } from "@/components/shared/PageContainer";
import { analyticsService } from "@/lib/services/analytics.service";

import { DashboardSkeleton } from "@/features/admin/dashboard/DashboardSkeleton";
import { AdminWelcomeHeader } from "@/features/admin/dashboard/AdminWelcomeHeader";
import { AdminStatistics } from "@/features/admin/dashboard/AdminStatistics";
import { AdminCharts } from "@/features/admin/dashboard/AdminCharts";
import { PlatformHealthWidget } from "@/features/admin/dashboard/PlatformHealthWidget";
import { RecentActivity } from "@/features/admin/dashboard/RecentActivity";
import { NotificationsPanel } from "@/features/admin/dashboard/NotificationsPanel";
import { QuickActions } from "@/features/admin/dashboard/QuickActions";

export default function AdminDashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/sign-in");
    } else if (user) {
      // Still using existing backend service, combined with mock data
      analyticsService.getAdminDashboard().then(res => {
        setData(res);
        setIsLoading(false);
      }).catch(err => {
        console.error("Failed to load admin dashboard", err);
        setIsLoading(false);
      });
    }
  }, [user, loading, router]);

  if (loading || !user || isLoading) {
    return <DashboardSkeleton />;
  }

  // Combine backend data with mocked expanded metrics
  const stats = {
    totalUsers: data?.totalUsers || 15420,
    activeJobSeekers: 8500,
    activeEmployers: 4200,
    activeFreelancers: 2100,
    activeTrainers: 620,
    jobsPosted: data?.totalJobs || 3450,
    courses: data?.totalCourses || 120,
    premiumMembers: 2450,
    monthlyRevenue: 125400,
    activeCoupons: 14,
    expiringSubscriptions: 85,
  };

  const userGrowthData = [
    { name: 'Jan', users: 4000 },
    { name: 'Feb', users: 5000 },
    { name: 'Mar', users: 7000 },
    { name: 'Apr', users: 8500 },
    { name: 'May', users: 11000 },
    { name: 'Jun', users: 15420 },
  ];

  const revenueData = [
    { name: 'Jan', revenue: 45000 },
    { name: 'Feb', revenue: 52000 },
    { name: 'Mar', revenue: 78000 },
    { name: 'Apr', revenue: 95000 },
    { name: 'May', revenue: 110000 },
    { name: 'Jun', revenue: 125400 },
  ];

  const activities = [
    { id: "1", user: { name: "Alice Smith" }, action: "upgraded to", target: "Employer Enterprise", time: "10 mins ago" },
    { id: "2", user: { name: "John Doe" }, action: "published course", target: "React Masterclass", time: "1 hour ago" },
    { id: "3", user: { name: "Sarah Tech" }, action: "posted job", target: "Senior Backend Engineer", time: "2 hours ago" },
  ];

  const notifications = [
    { id: "1", title: "High Traffic Alert", message: "User registrations spiked by 200% in the last hour.", type: "warning", time: "30 mins ago" },
    { id: "2", title: "Payment Gateway", message: "Stripe API response times are slightly degraded.", type: "error", time: "2 hours ago" },
    { id: "3", title: "System Update", message: "Platform v2.4 successfully deployed.", type: "success", time: "1 day ago" },
  ] as any[];

  return (
    <PageContainer>
      <div className="space-y-8 pb-10">
        <AdminWelcomeHeader user={user} />
        
        <AdminStatistics stats={stats} />
        
        <AdminCharts userGrowthData={userGrowthData} revenueData={revenueData} />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
            <RecentActivity activities={activities} />
            <NotificationsPanel notifications={notifications} />
          </div>
          <div className="space-y-6">
            <PlatformHealthWidget />
            <QuickActions />
          </div>
        </div>
      </div>
    </PageContainer>
  );
}

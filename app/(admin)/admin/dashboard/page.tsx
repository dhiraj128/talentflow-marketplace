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

  const stats = data?.stats || {
    totalUsers: 0,
    activeJobSeekers: 0,
    activeEmployers: 0,
    activeFreelancers: 0,
    activeTrainers: 0,
    jobsPosted: 0,
    courses: 0,
    premiumMembers: 0,
    monthlyRevenue: 0,
    activeCoupons: 0,
    expiringSubscriptions: 0,
  };

  const userGrowthData = data?.charts?.userGrowthData || [];
  const revenueData = data?.charts?.revenueData || [];

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

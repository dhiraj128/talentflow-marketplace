"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { PageContainer } from "@/components/shared/PageContainer";
import { analyticsService } from "@/lib/services/analytics.service";
import { DashboardSkeleton } from "@/features/admin/dashboard/DashboardSkeleton"; // Borrowing skeleton for visual consistency

import { TrainerDashboard } from "@/features/training/trainer/TrainerDashboard";
import { CourseManagement } from "@/features/training/trainer/CourseManagement";
import { StudentAnalytics } from "@/features/training/trainer/StudentAnalytics";
import { RevenueOverview } from "@/features/training/trainer/RevenueOverview";
import { CoursePerformance } from "@/features/training/trainer/CoursePerformance";
import { TrainerActivityFeed } from "@/features/training/trainer/TrainerActivityFeed";
import { TrainerNotifications } from "@/features/training/trainer/TrainerNotifications";

export default function TrainerDashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/sign-in");
    } else if (user) {
      analyticsService.getTrainerDashboard().then(res => {
        setData(res);
        setIsLoading(false);
      }).catch(err => {
        console.error("Failed to load trainer dashboard", err);
        setIsLoading(false);
      });
    }
  }, [user, loading, router]);

  if (loading || !user || isLoading) {
    return (
      <PageContainer className="py-8">
        <DashboardSkeleton />
      </PageContainer>
    );
  }

  return (
    <PageContainer className="py-8">
      <div className="flex flex-col gap-8">
        
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight mb-2">Trainer Dashboard</h1>
            <p className="text-muted-foreground">Manage your courses, track student progress, and monitor revenue.</p>
          </div>
        </div>

        <TrainerDashboard data={data} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          <div className="lg:col-span-2 space-y-6">
            <StudentAnalytics data={data} />
            <RevenueOverview data={data} />
            <CourseManagement data={data} />
          </div>
          
          <div className="space-y-6">
            <TrainerNotifications data={data} />
            <CoursePerformance data={data} />
            <TrainerActivityFeed data={data} />
          </div>
        </div>

      </div>
    </PageContainer>
  );
}

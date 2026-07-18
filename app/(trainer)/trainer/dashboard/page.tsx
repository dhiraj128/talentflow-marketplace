"use client";

import { PageContainer } from "@/components/shared/PageContainer";
import { TrainerDashboard } from "@/features/training/trainer/TrainerDashboard";
import { CourseManagement } from "@/features/training/trainer/CourseManagement";
import { StudentAnalytics } from "@/features/training/trainer/StudentAnalytics";
import { RevenueOverview } from "@/features/training/trainer/RevenueOverview";
import { CoursePerformance } from "@/features/training/trainer/CoursePerformance";
import { TrainerActivityFeed } from "@/features/training/trainer/TrainerActivityFeed";
import { TrainerNotifications } from "@/features/training/trainer/TrainerNotifications";

export default function TrainerDashboardPage() {
  return (
    <PageContainer className="py-8">
      <div className="flex flex-col gap-8">
        
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight mb-2">Trainer Dashboard</h1>
            <p className="text-muted-foreground">Manage your courses, track student progress, and monitor revenue.</p>
          </div>
        </div>

        <TrainerDashboard />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <StudentAnalytics />
            <RevenueOverview />
            <CourseManagement />
          </div>
          
          <div className="space-y-6">
            <TrainerNotifications />
            <CoursePerformance />
            <TrainerActivityFeed />
          </div>
        </div>

      </div>
    </PageContainer>
  );
}

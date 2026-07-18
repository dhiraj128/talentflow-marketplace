"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { PageContainer } from "@/components/shared/PageContainer";
import { analyticsService } from "@/lib/services/analytics.service";

// Dashboard Components
import { EmployerWelcomeHeader } from "@/features/employer/dashboard/EmployerWelcomeHeader";
import { EmployerVerificationWidget } from "@/features/employer/dashboard/EmployerVerificationWidget";
import { EmployerDashboardStatistics } from "@/features/employer/dashboard/EmployerDashboardStatistics";
import { HiringFunnelWidget } from "@/features/employer/dashboard/HiringFunnelWidget";
import { AICandidateRecommendations } from "@/features/employer/dashboard/AICandidateRecommendations";
import { EmployerRecentApplications } from "@/features/employer/dashboard/EmployerRecentApplications";
import { HiringAnalyticsCharts } from "@/features/employer/dashboard/HiringAnalyticsCharts";
import { InterviewScheduleTimeline, Interview } from "@/features/employer/dashboard/InterviewScheduleTimeline";
import { ShortlistedCandidatesWidget } from "@/features/employer/dashboard/ShortlistedCandidatesWidget";
import { EmployerActivityFeed } from "@/features/employer/dashboard/EmployerActivityFeed";
import { EmployerNotifications } from "@/features/employer/dashboard/EmployerNotifications";
import { DashboardSkeleton } from "@/features/employer/dashboard/DashboardSkeleton";
import { CandidateCardProps } from "@/features/employer/shared/CandidateCard";

export default function EmployerDashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/sign-in");
    } else if (user) {
      // We still call the existing API, and mock the missing pieces.
      analyticsService.getEmployerDashboard().then(res => {
        setData(res);
        setIsLoading(false);
      }).catch(err => {
        console.error("Failed to load dashboard data", err);
        setIsLoading(false);
      });
    }
  }, [user, loading, router]);

  if (loading || !user || isLoading) {
    return <DashboardSkeleton />;
  }

  // MOCK DATA TRANSFORMATIONS for AI / Premium features not in backend

  const stats = {
    activeJobs: data?.stats?.activeJobs || 3,
    applications: data?.stats?.totalApplications || 42,
    shortlisted: data?.stats?.shortlisted || 12,
    interviews: data?.stats?.interviewsScheduled || 5,
    hired: data?.stats?.hiredCandidates || 2,
    jobViews: 1250,
    candidateViews: 340,
    aiMatchAccuracy: 94
  };

  const funnelStages = [
    { label: "Jobs Posted", count: stats.activeJobs, percentage: 100 },
    { label: "Applications", count: stats.applications, percentage: 100 },
    { label: "AI Screening Passed", count: Math.floor(stats.applications * 0.7), percentage: 70 },
    { label: "Shortlisted", count: stats.shortlisted, percentage: Math.floor((stats.shortlisted / stats.applications) * 100) },
    { label: "Interviews", count: stats.interviews, percentage: Math.floor((stats.interviews / stats.applications) * 100) },
    { label: "Offers Sent", count: stats.hired + 1, percentage: Math.floor(((stats.hired + 1) / stats.applications) * 100) },
    { label: "Hired", count: stats.hired, percentage: Math.floor((stats.hired / stats.applications) * 100) }
  ];

  const aiCandidates = [
    {
      id: "cand-1",
      name: "Alex Johnson",
      role: "Senior Frontend Engineer",
      experience: "5 Yrs",
      matchScore: 98,
      atsScore: 95,
      skills: ["React", "TypeScript", "Next.js", "Tailwind"],
      missingSkills: [],
      certifications: ["AWS Certified Developer"],
      isAtsOptimized: true
    },
    {
      id: "cand-2",
      name: "Sarah Chen",
      role: "Full Stack Developer",
      experience: "3 Yrs",
      matchScore: 92,
      atsScore: 85,
      skills: ["React", "Node.js", "PostgreSQL"],
      missingSkills: ["GraphQL"],
      isAtsOptimized: false
    },
    {
      id: "cand-3",
      name: "Michael Smith",
      role: "Frontend Developer",
      experience: "2 Yrs",
      matchScore: 88,
      atsScore: 78,
      skills: ["React", "JavaScript", "CSS"],
      missingSkills: ["TypeScript", "Next.js"],
      isAtsOptimized: true
    }
  ];

  const applications = (data?.recentApplications || []).map((app: any, idx: number) => ({
    id: app.id,
    candidateName: app.candidate?.fullName || "Applicant",
    position: app.job?.title || "Position",
    appliedAt: app.appliedAt,
    atsScore: app.matchScore || (80 + idx * 2),
    status: app.status,
    isAtsOptimized: idx % 2 === 0
  }));

  const trendData = [
    { name: 'Jan', applications: 400 },
    { name: 'Feb', applications: 300 },
    { name: 'Mar', applications: 550 },
    { name: 'Apr', applications: 480 },
    { name: 'May', applications: 700 },
    { name: 'Jun', applications: 850 },
  ];

  const sourceData = [
    { name: 'AI Matches', value: 45 },
    { name: 'Organic', value: 30 },
    { name: 'Referral', value: 15 },
    { name: 'Agency', value: 10 },
  ];

  const shortlistedCards: CandidateCardProps[] = [
    { id: "s-1", name: "David Kim", role: "Product Designer", experience: "4 Yrs", matchScore: 94, skills: ["Figma", "UI/UX"], isAtsOptimized: true },
    { id: "s-2", name: "Elena Rodriguez", role: "Backend Engineer", experience: "6 Yrs", matchScore: 91, skills: ["Python", "Django", "AWS"] }
  ];

  const upcomingInterviews: Interview[] = [
    { id: "i-1", candidateName: "David Kim", position: "Product Designer", date: "Today", time: "2:00 PM", type: "Video Call", status: "Upcoming" },
    { id: "i-2", candidateName: "Elena Rodriguez", position: "Backend Engineer", date: "Tomorrow", time: "10:30 AM", type: "Video Call", status: "Upcoming" }
  ];

  const activities = [
    { id: "a-1", type: "CANDIDATE_APPLIED", title: "Alex Johnson applied for Senior Frontend Engineer", timestamp: "2 hours ago" },
    { id: "a-2", type: "INTERVIEW_SCHEDULED", title: "Interview scheduled with David Kim", timestamp: "5 hours ago" },
    { id: "a-3", type: "JOB_POSTED", title: "Published new job: Product Designer", timestamp: "1 day ago" }
  ] as any[];

  const notifications = [
    { id: "n-1", type: "AI_MATCH", title: "New 98% AI Match", message: "Alex Johnson perfectly matches your Senior Frontend Engineer role.", time: "1h ago", isRead: false },
    { id: "n-2", type: "VERIFICATION", title: "Verification Under Review", message: "Your company documents are being reviewed by our team.", time: "4h ago", isRead: false },
    { id: "n-3", type: "ADMIN_MESSAGE", title: "Job Approved", message: "Your job 'Product Designer' is now live.", time: "1d ago", isRead: true }
  ] as any[];

  return (
    <PageContainer>
      <div className="space-y-8 pb-10">
        <EmployerWelcomeHeader user={user} />
        
        <EmployerVerificationWidget status="UNDER_REVIEW" />
        
        <EmployerDashboardStatistics stats={stats} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-8">
            <HiringFunnelWidget stages={funnelStages} />
            <AICandidateRecommendations candidates={aiCandidates} />
            {applications.length > 0 && <EmployerRecentApplications applications={applications} />}
            <HiringAnalyticsCharts trendData={trendData} sourceData={sourceData} />
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            <InterviewScheduleTimeline interviews={upcomingInterviews} />
            <ShortlistedCandidatesWidget candidates={shortlistedCards} />
            <EmployerActivityFeed activities={activities} />
            <EmployerNotifications notifications={notifications} />
          </div>
          
        </div>
      </div>
    </PageContainer>
  );
}

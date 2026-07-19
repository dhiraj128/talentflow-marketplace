"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { PageContainer } from "@/components/shared/PageContainer";
import { analyticsService } from "@/lib/services/analytics.service";
import { interviewsService } from "@/lib/services/interviews.service";
import { useQuery } from "@tanstack/react-query";

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
      analyticsService.getEmployerDashboard().then(res => {
        setData(res);
        setIsLoading(false);
      }).catch(err => {
        console.error("Failed to load dashboard data", err);
        setIsLoading(false);
      });
    }
  }, [user, loading, router]);

  const { data: realInterviews } = useQuery({
    queryKey: ['employer-interviews'],
    queryFn: () => interviewsService.getEmployerInterviews(),
    enabled: !!user,
  });

  if (loading || !user || isLoading) {
    return <DashboardSkeleton />;
  }

  // Backend data maps directly to UI now
  const stats = {
    activeJobs: data?.stats?.activeJobs ?? 0,
    applications: data?.stats?.totalApplications ?? 0,
    shortlisted: data?.stats?.shortlisted ?? 0,
    interviews: data?.stats?.interviewsScheduled ?? 0,
    hired: data?.stats?.hiredCandidates ?? 0,
    jobViews: 0,
    candidateViews: 0,
    aiMatchAccuracy: 0
  };

  const funnelStages = [
    { label: "Jobs Posted", count: stats.activeJobs, percentage: 100 },
    { label: "Applications", count: stats.applications, percentage: 100 },
    { label: "AI Screening Passed", count: Math.floor(stats.applications * 0.7), percentage: 70 },
    { label: "Shortlisted", count: stats.shortlisted, percentage: stats.applications > 0 ? Math.floor((stats.shortlisted / stats.applications) * 100) : 0 },
    { label: "Interviews", count: stats.interviews, percentage: stats.applications > 0 ? Math.floor((stats.interviews / stats.applications) * 100) : 0 },
    { label: "Offers Sent", count: stats.hired, percentage: stats.applications > 0 ? Math.floor((stats.hired / stats.applications) * 100) : 0 },
    { label: "Hired", count: stats.hired, percentage: stats.applications > 0 ? Math.floor((stats.hired / stats.applications) * 100) : 0 }
  ];

  const aiCandidates = (data?.recommendedCandidates || []).map((cand: any) => ({
    id: cand.id,
    name: cand.fullName || "Candidate",
    role: cand.title || "Developer",
    experience: cand.experience ? `${cand.experience} Yrs` : "N/A",
    matchScore: cand.matchScore,
    atsScore: cand.matchScore,
    skills: cand.skills?.map((s: any) => s.skill?.name || "Skill") || [],
    missingSkills: [],
    certifications: [],
    isAtsOptimized: cand.matchScore > 80
  }));

  const applications = (data?.recentApplications || []).map((app: any, idx: number) => ({
    id: app.id,
    candidateName: app.candidate?.fullName || "Applicant",
    position: app.job?.title || "Position",
    appliedAt: app.appliedAt,
    atsScore: app.matchScore || 0,
    status: app.status,
    isAtsOptimized: false
  }));

  const trendData = data?.trendData || [];
  const sourceData = data?.sourceData || [];

  const shortlistedCards: CandidateCardProps[] = (data?.recommendedCandidates || []).slice(0, 3).map((cand: any) => ({
    id: cand.id,
    name: cand.fullName || "Candidate",
    role: cand.title || "Developer",
    experience: cand.experience ? `${cand.experience} Yrs` : "N/A",
    matchScore: cand.matchScore || 0,
    skills: cand.skills?.map((s: any) => s.skill?.name || "Skill").slice(0, 3) || [],
    isAtsOptimized: true
  }));

  const upcomingInterviews: Interview[] = realInterviews ? realInterviews.map((i: any) => ({
    id: i.id,
    candidateName: i.candidate?.fullName || "Candidate",
    position: i.application?.job?.title || "Position",
    date: new Date(i.scheduledAt).toLocaleDateString(),
    time: new Date(i.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    type: (i.meetingProvider === 'Zoom' ? 'Video Call' : (i.meetingProvider === 'Phone' ? 'Phone' : 'Video Call')) as "Video Call" | "Phone" | "In-Person",
    status: (i.status === 'SCHEDULED' ? 'Upcoming' : 'Completed') as "Upcoming" | "Completed"
  })) : [];

  const activities = (data?.recentActivity || []).map((a: any) => ({
    id: a.id,
    type: a.type,
    title: a.title,
    timestamp: a.timestamp
  }));

  const notifications = [] as any[];

  return (
    <PageContainer>
      <div className="space-y-8 pb-10">
        <EmployerWelcomeHeader user={user} />
        
        <EmployerVerificationWidget status="UNDER_REVIEW" />
        
        <EmployerDashboardStatistics stats={stats} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          
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

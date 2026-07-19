"use client";

import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { PageContainer } from "@/components/shared/PageContainer";
import { analyticsService } from "@/lib/services/analytics.service";
import { formatDistanceToNow } from "date-fns";

// Dashboard Components
import { WelcomeHeader } from "@/features/job-seeker/dashboard/WelcomeHeader";
import { CareerJourneyTimeline } from "@/features/job-seeker/dashboard/CareerJourneyTimeline";
import { DashboardStatistics } from "@/features/job-seeker/dashboard/DashboardStatistics";
import { ProfileCompletionMeter } from "@/features/job-seeker/dashboard/ProfileCompletionMeter";
import { ResumeStrengthWidget } from "@/features/job-seeker/dashboard/ResumeStrengthWidget";
import { ATSResumeServicesWidget } from "@/features/job-seeker/dashboard/ATSResumeServicesWidget";
import { interviewsService } from "@/lib/services/interviews.service";
import { useQuery } from "@tanstack/react-query";
import { ResumeAnalyticsCard } from "@/features/job-seeker/dashboard/ResumeAnalyticsCard";
import { AIMatchEngine } from "@/features/job-seeker/dashboard/AIMatchEngine";
import { RecommendedJobsList } from "@/features/job-seeker/dashboard/RecommendedJobsList";
import { LearningRecommendationsPanel } from "@/features/job-seeker/dashboard/LearningRecommendationsPanel";
import { ApplicationTrackerTable } from "@/features/job-seeker/dashboard/ApplicationTrackerTable";
import { InterviewTimelineWidget } from "@/features/job-seeker/dashboard/InterviewTimelineWidget";
import { SavedJobsWidget } from "@/features/job-seeker/dashboard/SavedJobsWidget";
import { ActivityAndNotifications } from "@/features/job-seeker/dashboard/ActivityAndNotifications";
import { DashboardSkeleton } from "@/features/job-seeker/dashboard/DashboardSkeleton";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { Sparkles, Briefcase, GraduationCap } from "lucide-react";

// Phase 7 Training Hub Widgets
import { ContinueLearningBanner } from "@/features/training/dashboard/ContinueLearningBanner";
import { MyCoursesWidget } from "@/features/training/dashboard/MyCoursesWidget";
import { UpcomingAssessments } from "@/features/training/dashboard/UpcomingAssessments";
import { RecommendedCourses } from "@/features/training/dashboard/RecommendedCourses";
import { CertificatesWidget } from "@/features/training/dashboard/CertificatesWidget";

export default function CandidateDashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [isLoadingData, setIsLoadingData] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/sign-in");
    } else if (user) {
      analyticsService.getCandidateDashboard().then(res => {
        setData(res);
        setIsLoadingData(false);
      }).catch(err => {
        console.error("Failed to fetch dashboard data:", err);
        setIsLoadingData(false);
      });
    }
  }, [user, loading, router]);

  const { data: realInterviews } = useQuery({
    queryKey: ['candidate-interviews'],
    queryFn: () => interviewsService.getCandidateInterviews(),
    enabled: !!user,
  });

  if (loading || !user || isLoadingData) {
    return <DashboardSkeleton />;
  }

  // --- MOCK TRANSFORMATIONS FOR MISSING BACKEND DATA ---
  
  // Profile Completion Mock Data
  const missingProfileItems = [];
  if (data?.metrics?.profileCompletion < 100) {
    if (!(user as any)?.avatarUrl && !(user as any)?.avatar) missingProfileItems.push({ label: "Profile Photo", actionHref: "/job-seeker/profile" });
    missingProfileItems.push({ label: "Add Portfolio Link", actionHref: "/job-seeker/profile" });
    missingProfileItems.push({ label: "Update Certifications", actionHref: "/job-seeker/profile" });
  }

  // AI Match Mock Data (now dynamically fetched and calculated in backend)
  const aiMatchJobs = (data?.recommendedJobs || []).slice(0, 4).map((job: any) => ({
    id: job.id,
    matchScore: job.matchScore || 85,
    title: job.title,
    companyName: job.employer?.companyName || "Unknown Company",
    companyLogo: job.employer?.logoUrl,
    location: job.location || "Remote",
    salary: job.salaryRange ? `${job.salaryRange} LPA` : "Not specified",
    experience: job.type || "Full-Time", // Using type as placeholder for experience since job.type maps better for now
    skills: job.requiredSkills?.map((rs: any) => rs.skill?.name || "Skill") || [],
    missingSkills: [],
    postedDate: formatDistanceToNow(new Date(job.createdAt), { addSuffix: true })
  }));

  // Application Tracker Mock Data
  const trackerApplications = (data?.recentApplications || []).map((app: any) => ({
    id: app.id,
    companyName: app.job?.employer?.companyName || "Company",
    roleTitle: app.job?.title || "Role",
    appliedDate: new Date(app.appliedAt).toLocaleDateString(),
    status: app.status,
    lastUpdated: formatDistanceToNow(new Date(app.updatedAt || app.appliedAt), { addSuffix: true }),
    jobId: app.jobId
  }));

  // Interview Timeline Mock Data
  const upcomingInterviews = realInterviews ? realInterviews.map((i: any) => ({
    id: i.id,
    companyName: i.employer?.companyName || "Company",
    companyLogo: i.employer?.logoUrl || "/placeholder.svg",
    roleTitle: i.application?.job?.title || "Role",
    date: new Date(i.scheduledAt).toLocaleDateString(),
    time: new Date(i.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    type: (i.meetingProvider === 'Zoom' ? 'Video Call' : (i.meetingProvider === 'Phone' ? 'Phone' : 'Video Call')) as "Video Call" | "Phone" | "In-Person",
    status: (i.status === 'SCHEDULED' ? 'Upcoming' : 'Completed') as "Upcoming" | "Completed"
  })) : [];

  // Saved Jobs Mock Data
  const mockSavedJobs = [
    {
      id: "job-123",
      title: "Senior Full Stack Engineer",
      companyName: "Netflix",
      location: "Remote, US",
      savedAt: "1 day ago"
    }
  ];

  // Notifications & Activity Mock Data
  const mockNotifications = [
    {
      id: "n1",
      type: "AI_MATCH",
      title: "New 95% Match Found!",
      description: "A new Senior Frontend role at TechCorp perfectly matches your skills.",
      time: "2h ago",
      isRead: false,
      link: "/find-jobs/techcorp-frontend"
    },
    {
      id: "n2",
      type: "INTERVIEW_REMINDER",
      title: "Interview Tomorrow",
      description: "Don't forget your technical interview with Stripe at 10:00 AM.",
      time: "5h ago",
      isRead: false
    }
  ] as any[];

  const mockActivities = data?.recentActivity?.length ? data.recentActivity : [
    { id: "a1", title: "Applied to Vercel", timestamp: "1 day ago", type: "application" },
    { id: "a2", title: "Updated Resume", timestamp: "2 days ago", type: "resume" }
  ];

  // Determine current career step based on data
  let currentStepIndex = 1; // Build profile
  if (data?.metrics?.profileCompletion > 80) currentStepIndex = 2; // AI matches
  if (trackerApplications.length > 0) currentStepIndex = 3; // Applied
  if (trackerApplications.some((a: any) => ["REVIEWING", "SHORTLISTED"].includes(a.status))) currentStepIndex = 4;
  if (trackerApplications.some((a: any) => ["INTERVIEWING"].includes(a.status))) currentStepIndex = 5;
  if (trackerApplications.some((a: any) => ["OFFERED"].includes(a.status))) currentStepIndex = 6;

  return (
    <PageContainer>
      <div className="space-y-8 pb-10">
        
        {/* Welcome Section */}
        <WelcomeHeader 
          user={user} 
          resumeStatus={data?.metrics?.profileCompletion > 50 ? "Complete" : "Needs Update"}
        />

        {/* Phase 7: LMS Integration (Continue Learning) */}
        <ContinueLearningBanner />

        {/* Career Journey */}
        <div className="space-y-4">
          <SectionHeader title="Your Career Journey" />
          <CareerJourneyTimeline currentStepIndex={currentStepIndex} />
        </div>

        {/* Dashboard Statistics */}
        <DashboardStatistics stats={{
          applied: data?.stats?.activeApplications || 0,
          shortlisted: trackerApplications.filter((a: any) => a.status === "REVIEWING" || a.status === "SHORTLISTED").length,
          interviews: trackerApplications.filter((a: any) => a.status === "INTERVIEWING").length,
          offers: trackerApplications.filter((a: any) => a.status === "OFFERED").length,
          savedJobs: data?.stats?.savedJobs || 1,
          resumeViews: data?.stats?.resumeViews || 14,
          profileViews: 42,
          aiMatchScore: data?.metrics?.jobMatchScore || 85
        }} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Main Content Column */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* AI Matches */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-500" />
                <h2 className="text-xl font-semibold tracking-tight">Top AI Matches</h2>
              </div>
              <AIMatchEngine jobs={aiMatchJobs} />
            </div>

            {/* Application Tracker */}
            <div className="space-y-4 pt-4">
              <ApplicationTrackerTable applications={trackerApplications} />
            </div>

            {/* Recommended Jobs */}
            <div className="space-y-4 pt-4">
              <div className="flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-blue-500" />
                <h2 className="text-xl font-semibold tracking-tight">Recommended Jobs</h2>
              </div>
              <RecommendedJobsList jobs={data?.recommendedJobs || []} />
            </div>

            {/* Phase 7: Training Hub (My Courses & Recommendations) */}
            <div className="space-y-4 pt-4">
              <MyCoursesWidget />
            </div>
            
            <div className="space-y-4 pt-4">
              <RecommendedCourses />
            </div>

          </div>

          {/* Right Sidebar Column */}
          <div className="space-y-6">
            
            <ProfileCompletionMeter 
              score={data?.metrics?.profileCompletion || 65} 
              missingItems={missingProfileItems} 
            />

            <ATSResumeServicesWidget 
              score={88} 
              hasPremium={false} 
            />
            
            <ResumeAnalyticsCard />

            <ResumeStrengthWidget 
              atsScore={82}
              completeness={90}
              keywordOptimization="Strong match for 'Frontend Engineer'"
              suggestions={[
                "Add more quantifiable achievements",
                "Include link to your GitHub profile"
              ]}
            />

            {/* Phase 7: Training Hub Widgets */}
            <UpcomingAssessments />
            <CertificatesWidget />

            <ActivityAndNotifications 
              activities={mockActivities} 
              notifications={mockNotifications} 
            />

            <InterviewTimelineWidget interviews={upcomingInterviews} />

            <SavedJobsWidget jobs={mockSavedJobs} />
            
          </div>
        </div>

      </div>
    </PageContainer>
  );
}

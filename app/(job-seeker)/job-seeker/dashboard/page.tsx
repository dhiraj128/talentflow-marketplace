"use client";

import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { PageContainer } from "@/components/shared/PageContainer";
import { StatsGrid } from "@/components/shared/StatsGrid";
import { MetricCard } from "@/components/shared/MetricCard";
import { JobCard } from "@/components/shared/JobCard";
import { CourseCard } from "@/components/shared/CourseCard";
import { Timeline } from "@/components/shared/Timeline";
import { ActivityFeed } from "@/components/shared/ActivityFeed";
import { ProfileCompletionCard } from "@/components/shared/ProfileCompletionCard";
import { 
  FileText, Eye, Search, Bookmark, Mail,
  Target, FileCheck, Clock, UserCheck, Bell, Briefcase
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { analyticsService } from "@/lib/services/analytics.service";

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

  if (loading || !user || isLoadingData) return null;

  return (
    <PageContainer>
      <PageHeader 
        title={`Welcome back, ${user?.name || user?.email?.split("@")[0]}! 👋`}
        description="Here's your career dashboard and job search overview."
        action={
          <Button nativeButton={false} render={<Link href="/talent" />}>
            <Search className="mr-2 h-4 w-4" /> Search Jobs
          </Button>
        }
      />

      <StatsGrid
        stats={[
          { label: "Active Applications", value: data?.stats?.activeApplications || "0", icon: <FileText className="h-4 w-4 text-blue-500" /> },
          { label: "Saved Jobs", value: data?.stats?.savedJobs || "0", icon: <Bookmark className="h-4 w-4 text-purple-500" /> },
          { label: "Resume Views", value: data?.stats?.resumeViews || "0", icon: <Eye className="h-4 w-4 text-green-500" /> },
          { label: "Recruiter Invites", value: data?.stats?.recruiterInvites || "0", icon: <Mail className="h-4 w-4 text-amber-500" /> },
        ]}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard title="Job Match Score" value={`${data?.metrics?.jobMatchScore || 0}%`} description="Top 5% of candidates" icon={<Target className="h-4 w-4" />} trend="up" trendValue="+3%" />
        <MetricCard title="Resume Strength" value="Strong" description="Ready to apply" icon={<FileCheck className="h-4 w-4" />} />
        <MetricCard title="Recently Viewed" value={data?.metrics?.recentlyViewed?.toString() || "0"} description="In the last 7 days" icon={<Clock className="h-4 w-4" />} />
        <MetricCard title="Profile Completion" value={`${data?.metrics?.profileCompletion || 0}%`} description="Almost there!" icon={<UserCheck className="h-4 w-4" />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-8">
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold tracking-tight">Recommended & Quick Apply</h2>
              <Button variant="link" nativeButton={false} render={<Link href="/job-seeker/recommended" />}>
                View All
              </Button>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              {data?.recommendedJobs?.map((job: any) => (
                <JobCard key={job.id} {...job} company={job.employer?.companyName} />
              ))}
              {(!data?.recommendedJobs || data.recommendedJobs.length === 0) && (
                <p className="text-muted-foreground text-sm">No recommended jobs yet.</p>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold tracking-tight">Learning Recommendations</h2>
              <Button variant="link" nativeButton={false} render={<Link href="/job-seeker/learning" />}>
                Browse Courses
              </Button>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              {data?.recommendedCourses?.map((course: any) => (
                <CourseCard key={course.id} {...course} price={`$${course.price || '49.99'}`} />
              ))}
              {(!data?.recommendedCourses || data.recommendedCourses.length === 0) && (
                <p className="text-muted-foreground text-sm">No recommended courses yet.</p>
              )}
            </div>
          </div>

        </div>

        <div className="space-y-6">
          <ProfileCompletionCard
            score={data?.metrics?.profileCompletion || 0}
            missingItems={[
              { label: "Add Portfolio Link", href: "/job-seeker/profile" },
            ]}
          />
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Upcoming Interviews</CardTitle>
            </CardHeader>
            <CardContent>
              {data?.upcomingInterviews?.length > 0 ? (
                 <Timeline items={data.upcomingInterviews} />
              ) : (
                 <p className="text-sm text-muted-foreground">No upcoming interviews scheduled.</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Skill Progress</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">React</span>
                  <span className="text-muted-foreground">85%</span>
                </div>
                <Progress value={85} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">TypeScript</span>
                  <span className="text-muted-foreground">70%</span>
                </div>
                <Progress value={70} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">Node.js</span>
                  <span className="text-muted-foreground">60%</span>
                </div>
                <Progress value={60} className="h-2" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              {data?.recentActivity?.length > 0 ? (
                 <ActivityFeed items={data.recentActivity} />
              ) : (
                 <p className="text-sm text-muted-foreground">No recent activity.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
}

"use client";

import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatsGrid } from "@/components/shared/StatsGrid";
import { MetricCard } from "@/components/shared/MetricCard";
import { JobCard } from "@/components/shared/JobCard";
import { CourseCard } from "@/components/shared/CourseCard";
import { Timeline } from "@/components/shared/Timeline";
import { ActivityFeed } from "@/components/shared/ActivityFeed";
import { ProfileCompletionCard } from "@/components/shared/ProfileCompletionCard";
import { 
  FileText, Eye, Search, Bookmark, Mail,
  Target, FileCheck, Clock, UserCheck, Bell
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const MOCK_JOBS = [
  { id: "1", title: "Senior React Developer", company: "TechCorp Inc.", location: "San Francisco, CA (Hybrid)", salary: "$120k - $160k", type: "Full-time", postedAt: "2 hours ago", matchScore: 95 },
  { id: "2", title: "Frontend Engineer", company: "InnovateTech", location: "Remote", salary: "$110k - $140k", type: "Full-time", postedAt: "1 day ago", matchScore: 92 },
];

const MOCK_COURSES = [
  { title: "Advanced React Patterns", instructor: "Sarah Drasner", rating: 4.9, enrolled: 12500, duration: "4h 30m", price: "$49.99" },
  { title: "Fullstack Next.js 14", instructor: "Lee Robinson", rating: 4.8, enrolled: 8300, duration: "6h 15m", price: "$79.99" },
];

const MOCK_INTERVIEWS = [
  { id: "1", title: "Technical Screen - TechCorp", description: "Video call with Engineering Manager", date: "Tomorrow, 10:00 AM", status: "upcoming" },
  { id: "2", title: "HR Screen - StartupHub", description: "Phone call", date: "Jul 18, 2:00 PM", status: "upcoming" },
  { id: "3", title: "Code Assessment", description: "Completed React Challenge", date: "Jul 12", status: "completed" },
];

const MOCK_ACTIVITY = [
  { id: "1", user: { name: "System" }, action: "Recommended new job", target: "Frontend Lead", time: "2h ago", icon: <Bell className="h-4 w-4" /> },
  { id: "2", user: { name: "Recruiter" }, action: "Viewed your", target: "Resume", time: "5h ago", icon: <Eye className="h-4 w-4" /> },
  { id: "3", user: { name: "TechCorp" }, action: "Invited you to", target: "Interview", time: "1d ago", icon: <Mail className="h-4 w-4" /> },
];

export default function CandidateDashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.push("/sign-in");
  }, [user, loading, router]);

  if (loading || !user) return null;

  return (
    <div className="max-w-7xl mx-auto p-8 space-y-8">
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
          { label: "Active Applications", value: "12", icon: <FileText className="h-4 w-4 text-blue-500" /> },
          { label: "Saved Jobs", value: "8", icon: <Bookmark className="h-4 w-4 text-purple-500" /> },
          { label: "Resume Views", value: "47", icon: <Eye className="h-4 w-4 text-green-500" /> },
          { label: "Recruiter Invites", value: "3", icon: <Mail className="h-4 w-4 text-amber-500" /> },
        ]}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard title="Job Match Score" value="92%" description="Top 5% of candidates" icon={<Target className="h-4 w-4" />} trend="up" trendValue="+3%" />
        <MetricCard title="Resume Strength" value="Strong" description="Ready to apply" icon={<FileCheck className="h-4 w-4" />} />
        <MetricCard title="Recently Viewed" value="24" description="In the last 7 days" icon={<Clock className="h-4 w-4" />} />
        <MetricCard title="Profile Completion" value="90%" description="Almost there!" icon={<UserCheck className="h-4 w-4" />} />
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
              {MOCK_JOBS.map((job) => (
                <JobCard key={job.id} {...job} />
              ))}
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
              {MOCK_COURSES.map((course) => (
                <CourseCard key={course.title} {...course} />
              ))}
            </div>
          </div>

        </div>

        <div className="space-y-6">
          <ProfileCompletionCard
            score={90}
            missingItems={[
              { label: "Add Portfolio Link", href: "/job-seeker/profile" },
            ]}
          />
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Upcoming Interviews</CardTitle>
            </CardHeader>
            <CardContent>
              <Timeline items={MOCK_INTERVIEWS} />
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
              <ActivityFeed items={MOCK_ACTIVITY} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

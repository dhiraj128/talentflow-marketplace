import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, FileText, CheckCircle, BarChart, PenTool } from "lucide-react";
import Link from "next/link";

export default function ResumeCenterPage() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Profile Completion</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">85%</div>
            <p className="text-xs text-muted-foreground mt-1">Excellent standing</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">ATS Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">92/100</div>
            <p className="text-xs text-muted-foreground mt-1">Highly compatible</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Profile Views</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">124</div>
            <p className="text-xs text-muted-foreground mt-1">+12% from last week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Versions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground mt-1">Tailored resumes</p>
          </CardContent>
        </Card>
      </div>

      <h2 className="text-xl font-semibold mt-8 mb-4">Quick Actions</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg text-primary">
                <PenTool className="h-6 w-6" />
              </div>
              <div>
                <CardTitle>Resume Builder</CardTitle>
                <CardDescription>Create or edit your professional resume</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Link href="/job-seeker/resume-center/builder">
              <Button className="w-full">
                Open Builder <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg text-primary">
                <CheckCircle className="h-6 w-6" />
              </div>
              <div>
                <CardTitle>ATS Check</CardTitle>
                <CardDescription>Analyze your resume against job descriptions</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Link href="/job-seeker/resume-center/ats">
              <Button variant="outline" className="w-full">
                Run ATS Scan <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg text-primary">
                <FileText className="h-6 w-6" />
              </div>
              <div>
                <CardTitle>Cover Letter</CardTitle>
                <CardDescription>Generate matching cover letters instantly</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Link href="/job-seeker/resume-center/cover-letter">
              <Button variant="outline" className="w-full">
                Create Cover Letter <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg text-primary">
                <BarChart className="h-6 w-6" />
              </div>
              <div>
                <CardTitle>Analytics</CardTitle>
                <CardDescription>Track performance of your documents</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Link href="/job-seeker/resume-center/analytics">
              <Button variant="outline" className="w-full">
                View Insights <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

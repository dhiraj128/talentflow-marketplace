"use client";

import { PageHeader } from "@/components/shared/PageHeader"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { StatsGrid } from "@/components/shared/StatsGrid"
import { Users, TrendingUp, BookOpen, Clock } from "lucide-react"

export default function AnalyticsPage() {
  const stats = [
    { label: "Total Students", value: "0", icon: <Users className="h-4 w-4" />, change: "No enrollments yet" },
    { label: "Course Completion Rate", value: "0%", icon: <TrendingUp className="h-4 w-4" />, change: "No data yet" },
    { label: "Active Enrollments", value: "0", icon: <BookOpen className="h-4 w-4" />, change: "No active students" },
    { label: "Avg. Watch Time", value: "0h 0m", icon: <Clock className="h-4 w-4" />, change: "No watch data" },
  ]

  return (
    <>
      <PageHeader 
        title="Analytics Dashboard" 
        description="Deep insights into your student engagement and course performance." 
      />
      
      <StatsGrid stats={stats} />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Student Growth</CardTitle>
            <CardDescription>New enrollments over the last 6 months</CardDescription>
          </CardHeader>
          <CardContent className="h-64 flex flex-col items-center justify-center text-center text-muted-foreground border-t">
            <Users className="w-10 h-10 text-muted-foreground/40 mb-2" />
            <p className="font-medium text-sm">No student growth data yet</p>
            <p className="text-xs text-muted-foreground/60 mt-1">Enrollment trends will appear as students join your courses.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Course Completion Rates</CardTitle>
            <CardDescription>Percentage of students finishing your courses</CardDescription>
          </CardHeader>
          <CardContent className="h-64 flex flex-col items-center justify-center text-center text-muted-foreground pt-4">
            <BookOpen className="w-10 h-10 text-muted-foreground/40 mb-2" />
            <p className="font-medium text-sm">No course completion data yet</p>
            <p className="text-xs text-muted-foreground/60 mt-1">Publish courses to track student progress.</p>
          </CardContent>
        </Card>
      </div>
    </>
  )
}

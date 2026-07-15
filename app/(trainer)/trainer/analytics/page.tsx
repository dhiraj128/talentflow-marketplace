import { PageHeader } from "@/components/shared/PageHeader"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { StatsGrid } from "@/components/shared/StatsGrid"
import { Users, TrendingUp, BookOpen, Clock } from "lucide-react"

export default function AnalyticsPage() {
  const stats = [
    { label: "Total Students", value: "1,248", icon: <Users className="h-4 w-4" />, change: "+12% this month" },
    { label: "Course Completion Rate", value: "68%", icon: <TrendingUp className="h-4 w-4" />, change: "+5% this month" },
    { label: "Active Enrollments", value: "432", icon: <BookOpen className="h-4 w-4" />, change: "-2% this month" },
    { label: "Avg. Watch Time", value: "14h 20m", icon: <Clock className="h-4 w-4" />, change: "+1h this month" },
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
          <CardContent className="h-80 flex flex-col items-center justify-center border-t">
            <div className="w-full h-full flex items-end justify-between px-4 pb-4 pt-8 gap-2">
              <div className="w-full bg-primary/20 hover:bg-primary/40 rounded-t-sm h-[30%] relative group"><span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs opacity-0 group-hover:opacity-100">120</span></div>
              <div className="w-full bg-primary/20 hover:bg-primary/40 rounded-t-sm h-[45%] relative group"><span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs opacity-0 group-hover:opacity-100">180</span></div>
              <div className="w-full bg-primary/20 hover:bg-primary/40 rounded-t-sm h-[40%] relative group"><span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs opacity-0 group-hover:opacity-100">160</span></div>
              <div className="w-full bg-primary/20 hover:bg-primary/40 rounded-t-sm h-[60%] relative group"><span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs opacity-0 group-hover:opacity-100">240</span></div>
              <div className="w-full bg-primary/20 hover:bg-primary/40 rounded-t-sm h-[80%] relative group"><span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs opacity-0 group-hover:opacity-100">320</span></div>
              <div className="w-full bg-primary hover:bg-primary/80 rounded-t-sm h-[100%] relative group"><span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs opacity-0 group-hover:opacity-100">400</span></div>
            </div>
            <div className="w-full flex justify-between px-4 text-xs text-muted-foreground">
              <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Course Completion Rates</CardTitle>
            <CardDescription>Percentage of students finishing your courses</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 pt-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium">Advanced React Patterns</span>
                <span className="text-muted-foreground">78%</span>
              </div>
              <div className="h-2 bg-secondary rounded-full overflow-hidden">
                <div className="h-full bg-primary w-[78%]"></div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium">Next.js Fullstack Mastery</span>
                <span className="text-muted-foreground">62%</span>
              </div>
              <div className="h-2 bg-secondary rounded-full overflow-hidden">
                <div className="h-full bg-primary w-[62%]"></div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium">CSS Architecture</span>
                <span className="text-muted-foreground">85%</span>
              </div>
              <div className="h-2 bg-secondary rounded-full overflow-hidden">
                <div className="h-full bg-primary w-[85%]"></div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium">TypeScript Fundamentals</span>
                <span className="text-muted-foreground">45%</span>
              </div>
              <div className="h-2 bg-secondary rounded-full overflow-hidden">
                <div className="h-full bg-primary w-[45%]"></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}

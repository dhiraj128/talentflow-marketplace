import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, BookOpen, CheckCircle2, PlayCircle, Award } from "lucide-react";

export function LearningActivityFeed() {
  const activities = [
    {
      id: 1,
      type: "complete",
      title: "Completed Module: React Server Components",
      course: "Advanced React Patterns",
      time: "2 hours ago",
      icon: CheckCircle2,
      color: "text-green-500",
      bg: "bg-green-100 dark:bg-green-900/30"
    },
    {
      id: 2,
      type: "enroll",
      title: "Enrolled in Course",
      course: "Node.js Microservices Masterclass",
      time: "Yesterday",
      icon: BookOpen,
      color: "text-blue-500",
      bg: "bg-blue-100 dark:bg-blue-900/30"
    },
    {
      id: 3,
      type: "certificate",
      title: "Earned Certificate",
      course: "UI/UX Fundamentals",
      time: "2 days ago",
      icon: Award,
      color: "text-amber-500",
      bg: "bg-amber-100 dark:bg-amber-900/30"
    },
    {
      id: 4,
      type: "watch",
      title: "Watched 4 Lessons",
      course: "Advanced React Patterns",
      time: "3 days ago",
      icon: PlayCircle,
      color: "text-purple-500",
      bg: "bg-purple-100 dark:bg-purple-900/30"
    }
  ];

  return (
    <Card className="border-muted/60">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-bold flex items-center gap-2">
          <Activity className="w-5 h-5 text-blue-500" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent">
          {activities.map((item, index) => (
            <div key={item.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full border-4 border-background shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm z-10 ${item.bg} ${item.color}`}>
                <item.icon className="w-4 h-4" />
              </div>
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-lg border border-border/50 bg-card shadow-sm group-hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-semibold text-sm">{item.title}</h4>
                </div>
                <p className="text-xs text-muted-foreground">{item.course}</p>
                <div className="text-[10px] font-medium text-muted-foreground/80 mt-2 uppercase tracking-wider">{item.time}</div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

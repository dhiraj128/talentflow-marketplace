import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, Users, DollarSign, Star } from "lucide-react";

export function TrainerDashboard({ data }: { data?: any }) {
  const stats = [
    { label: "Published Courses", value: data?.publishedCourses ?? 0, icon: BookOpen, color: "text-blue-500", bg: "bg-blue-100 dark:bg-blue-900/30" },
    { label: "Total Students", value: data?.totalStudents ?? 0, icon: Users, color: "text-green-500", bg: "bg-green-100 dark:bg-green-900/30" },
    { label: "Total Revenue", value: `$${data?.revenue ?? 0}`, icon: DollarSign, color: "text-amber-500", bg: "bg-amber-100 dark:bg-amber-900/30" },
    { label: "Average Rating", value: data?.courseRating ?? 0, icon: Star, color: "text-purple-500", bg: "bg-purple-100 dark:bg-purple-900/30" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, i) => (
        <Card key={i} className="border-border/60 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">{stat.label}</p>
              <h3 className="text-2xl font-bold">{stat.value}</h3>
            </div>
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${stat.bg} ${stat.color}`}>
              <stat.icon className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

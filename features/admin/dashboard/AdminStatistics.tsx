import { Users, Building2, Briefcase, GraduationCap, DollarSign, Tag, Clock, BookOpen, UserCheck } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export interface AdminStats {
  totalUsers: number;
  activeJobSeekers: number;
  activeEmployers: number;
  activeFreelancers: number;
  activeTrainers: number;
  jobsPosted: number;
  courses: number;
  premiumMembers: number;
  monthlyRevenue: number;
  activeCoupons: number;
  expiringSubscriptions: number;
}

interface AdminStatisticsProps {
  stats: AdminStats;
}

export function AdminStatistics({ stats }: AdminStatisticsProps) {
  const statItems = [
    { label: "Total Users", value: stats.totalUsers.toLocaleString(), icon: Users, color: "text-blue-500", bg: "bg-blue-500/10" },
    { label: "Employers", value: stats.activeEmployers.toLocaleString(), icon: Building2, color: "text-indigo-500", bg: "bg-indigo-500/10" },
    { label: "Freelancers", value: stats.activeFreelancers.toLocaleString(), icon: Briefcase, color: "text-purple-500", bg: "bg-purple-500/10" },
    { label: "Trainers", value: stats.activeTrainers.toLocaleString(), icon: GraduationCap, color: "text-pink-500", bg: "bg-pink-500/10" },
    { label: "Job Seekers", value: stats.activeJobSeekers.toLocaleString(), icon: UserCheck, color: "text-sky-500", bg: "bg-sky-500/10" },
    { label: "Revenue", value: `$${(stats.monthlyRevenue / 1000).toFixed(1)}k`, icon: DollarSign, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { label: "Active Jobs", value: stats.jobsPosted.toLocaleString(), icon: Briefcase, color: "text-amber-500", bg: "bg-amber-500/10" },
    { label: "Courses", value: stats.courses.toLocaleString(), icon: BookOpen, color: "text-orange-500", bg: "bg-orange-500/10" },
    { label: "Coupons", value: stats.activeCoupons.toLocaleString(), icon: Tag, color: "text-rose-500", bg: "bg-rose-500/10" },
    { label: "Expiring Subs", value: stats.expiringSubscriptions.toLocaleString(), icon: Clock, color: "text-red-500", bg: "bg-red-500/10" },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {statItems.map((item, index) => (
        <Card key={index} className="overflow-hidden bg-background/50 backdrop-blur border-border/50 shadow-sm transition-all hover:shadow-md hover:border-border">
          <CardContent className="p-4 flex flex-col justify-between h-full min-h-[110px]">
            <div className="flex justify-between items-start mb-2">
              <span className="text-sm font-medium text-muted-foreground">{item.label}</span>
              <div className={`p-2 rounded-lg ${item.bg}`}>
                <item.icon className={`w-4 h-4 ${item.color}`} />
              </div>
            </div>
            <div className="text-2xl font-bold tracking-tight">{item.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

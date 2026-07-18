import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Users, Briefcase, FileCheck, Calendar, CheckCircle2, TrendingUp, Search } from "lucide-react";
import { motion } from "framer-motion";

interface EmployerDashboardStatisticsProps {
  stats: {
    activeJobs: number;
    applications: number;
    shortlisted: number;
    interviews: number;
    hired: number;
    jobViews: number;
    candidateViews: number;
    aiMatchAccuracy: number;
  };
}

export function EmployerDashboardStatistics({ stats }: EmployerDashboardStatisticsProps) {
  const statItems = [
    { label: "Active Jobs", value: stats.activeJobs, icon: Briefcase, color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-900/20" },
    { label: "Applications", value: stats.applications, icon: FileCheck, color: "text-purple-500", bg: "bg-purple-50 dark:bg-purple-900/20" },
    { label: "Shortlisted", value: stats.shortlisted, icon: Users, color: "text-indigo-500", bg: "bg-indigo-50 dark:bg-indigo-900/20" },
    { label: "Interviews", value: stats.interviews, icon: Calendar, color: "text-orange-500", bg: "bg-orange-50 dark:bg-orange-900/20" },
    { label: "Hired (Monthly)", value: stats.hired, icon: CheckCircle2, color: "text-green-500", bg: "bg-green-50 dark:bg-green-900/20" },
    { label: "Job Views", value: stats.jobViews, icon: TrendingUp, color: "text-pink-500", bg: "bg-pink-50 dark:bg-pink-900/20" },
    { label: "Profile Views", value: stats.candidateViews, icon: Search, color: "text-teal-500", bg: "bg-teal-50 dark:bg-teal-900/20" },
    { label: "AI Accuracy", value: `${stats.aiMatchAccuracy}%`, icon: SparklesIcon, color: "text-yellow-500", bg: "bg-yellow-50 dark:bg-yellow-900/20" },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {statItems.map((item, index) => {
        const Icon = item.icon;
        return (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-5 flex items-center gap-4">
                <div className={`p-3 rounded-xl ${item.bg}`}>
                  <Icon className={`w-5 h-5 ${item.color}`} />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{item.label}</p>
                  <h3 className="text-2xl font-bold tracking-tight">{item.value}</h3>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}

function SparklesIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />
    </svg>
  );
}

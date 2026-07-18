import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Briefcase, Clock, Star, DollarSign, TrendingUp, CheckCircle2, UserCheck } from "lucide-react";
import { motion } from "framer-motion";

interface FreelancerStatisticsProps {
  stats: {
    activeServices: number;
    activeProjects: number;
    pendingBids: number;
    completedProjects: number;
    earnings: number;
    rating: number;
    profileCompletion: number;
  };
}

export function FreelancerStatistics({ stats }: FreelancerStatisticsProps) {
  const statItems = [
    { label: "Active Services", value: stats.activeServices, icon: Briefcase, color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-900/20" },
    { label: "Active Projects", value: stats.activeProjects, icon: Clock, color: "text-purple-500", bg: "bg-purple-50 dark:bg-purple-900/20" },
    { label: "Pending Bids", value: stats.pendingBids, icon: UserCheck, color: "text-amber-500", bg: "bg-amber-50 dark:bg-amber-900/20" },
    { label: "Completed", value: stats.completedProjects, icon: CheckCircle2, color: "text-green-500", bg: "bg-green-50 dark:bg-green-900/20" },
    { label: "Total Earnings", value: `$${stats.earnings}`, icon: DollarSign, color: "text-emerald-500", bg: "bg-emerald-50 dark:bg-emerald-900/20" },
    { label: "Avg Rating", value: stats.rating.toFixed(1), icon: Star, color: "text-yellow-500", bg: "bg-yellow-50 dark:bg-yellow-900/20" },
    { label: "Profile", value: `${stats.profileCompletion}%`, icon: TrendingUp, color: "text-indigo-500", bg: "bg-indigo-50 dark:bg-indigo-900/20" },
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

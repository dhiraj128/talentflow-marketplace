"use client";

import React, { useEffect, useState } from "react";
import { motion, useAnimation, useInView } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { 
  FileText, CheckCircle2, Calendar, Award, 
  Bookmark, Eye, User, Target 
} from "lucide-react";
import { cn } from "@/lib/utils";

interface StatItem {
  label: string;
  value: number;
  icon: React.ReactNode;
  trend?: string;
  colorClass?: string;
}

interface DashboardStatisticsProps {
  stats: {
    applied: number;
    shortlisted: number;
    interviews: number;
    offers: number;
    savedJobs: number;
    resumeViews: number;
    profileViews: number;
    aiMatchScore: number;
  };
}

const AnimatedCounter = ({ value }: { value: number }) => {
  const [count, setCount] = useState(0);
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      let start = 0;
      const end = value;
      const duration = 1.5; // seconds
      const incrementTime = 30; // ms
      const steps = duration * 1000 / incrementTime;
      const step = end / steps;

      const timer = setInterval(() => {
        start += step;
        if (start >= end) {
          setCount(end);
          clearInterval(timer);
        } else {
          setCount(Math.floor(start));
        }
      }, incrementTime);
      return () => clearInterval(timer);
    }
  }, [value, isInView]);

  return <span ref={ref}>{count}</span>;
};

export function DashboardStatistics({ stats }: DashboardStatisticsProps) {
  const statItems: StatItem[] = [
    { label: "Applied Jobs", value: stats.applied, icon: <FileText className="w-5 h-5 text-blue-500" />, colorClass: "bg-blue-500/10" },
    { label: "Shortlisted", value: stats.shortlisted, icon: <CheckCircle2 className="w-5 h-5 text-emerald-500" />, colorClass: "bg-emerald-500/10" },
    { label: "Interviews", value: stats.interviews, icon: <Calendar className="w-5 h-5 text-amber-500" />, colorClass: "bg-amber-500/10" },
    { label: "Offers", value: stats.offers, icon: <Award className="w-5 h-5 text-purple-500" />, colorClass: "bg-purple-500/10" },
    { label: "Saved Jobs", value: stats.savedJobs, icon: <Bookmark className="w-5 h-5 text-pink-500" />, colorClass: "bg-pink-500/10" },
    { label: "Resume Views", value: stats.resumeViews, icon: <Eye className="w-5 h-5 text-cyan-500" />, colorClass: "bg-cyan-500/10" },
    { label: "Profile Views", value: stats.profileViews, icon: <User className="w-5 h-5 text-indigo-500" />, colorClass: "bg-indigo-500/10" },
    { label: "AI Match Score", value: stats.aiMatchScore, icon: <Target className="w-5 h-5 text-rose-500" />, colorClass: "bg-rose-500/10" },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      {statItems.map((item, index) => (
        <motion.div
          key={item.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: index * 0.05 }}
        >
          <Card className="hover:shadow-md transition-all duration-300 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-xl border-zinc-200/50 dark:border-zinc-800/50 group">
            <CardContent className="p-4 sm:p-5 flex items-center gap-4">
              <div className={cn("p-3 rounded-xl transition-transform group-hover:scale-110", item.colorClass)}>
                {item.icon}
              </div>
              <div>
                <p className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                  <AnimatedCounter value={item.value} />
                  {item.label === "AI Match Score" && "%"}
                </p>
                <p className="text-sm font-medium text-muted-foreground line-clamp-1">{item.label}</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}

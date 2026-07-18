"use client";

import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, Award, Clock, Target, BrainCircuit, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

export function LearningStatistics() {
  const stats = [
    { label: "Enrolled Courses", value: "4", icon: BookOpen, color: "text-blue-500", bg: "bg-blue-100 dark:bg-blue-900/30" },
    { label: "Completed Courses", value: "12", icon: CheckCircle2, color: "text-green-500", bg: "bg-green-100 dark:bg-green-900/30" },
    { label: "Certificates Earned", value: "8", icon: Award, color: "text-amber-500", bg: "bg-amber-100 dark:bg-amber-900/30" },
    { label: "Learning Hours", value: "124h", icon: Clock, color: "text-purple-500", bg: "bg-purple-100 dark:bg-purple-900/30" },
    { label: "Avg Quiz Score", value: "92%", icon: Target, color: "text-rose-500", bg: "bg-rose-100 dark:bg-rose-900/30" },
    { label: "AI Skill Score", value: "850", icon: BrainCircuit, color: "text-indigo-500", bg: "bg-indigo-100 dark:bg-indigo-900/30" },
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8"
      variants={container}
      initial="hidden"
      animate="show"
    >
      {stats.map((stat, i) => (
        <motion.div key={i} variants={item}>
          <Card className="hover:shadow-md transition-shadow border-muted/60">
            <CardContent className="p-4 flex flex-col items-center justify-center text-center">
              <div className={`p-3 rounded-full mb-3 ${stat.bg} ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-xs text-muted-foreground font-medium mt-1 uppercase tracking-wider">{stat.label}</p>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  );
}

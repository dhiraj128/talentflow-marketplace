import React from "react";
import { Briefcase, CheckCircle, Clock, Zap } from "lucide-react";

interface FreelancerStatsProps {
  completedProjects: number;
  responseRate?: number;
  responseTime?: string;
  onTimeDelivery?: number;
}

export function FreelancerStats({ completedProjects, responseRate = 98, responseTime = "1 hour", onTimeDelivery = 100 }: FreelancerStatsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-muted/20 p-6 rounded-2xl border">
      <div className="space-y-1 text-center md:text-left">
        <p className="text-sm text-muted-foreground flex items-center justify-center md:justify-start gap-1.5">
          <Briefcase className="w-4 h-4" /> Completed
        </p>
        <p className="font-semibold text-lg">{completedProjects} Jobs</p>
      </div>
      
      <div className="space-y-1 text-center md:text-left">
        <p className="text-sm text-muted-foreground flex items-center justify-center md:justify-start gap-1.5">
          <Zap className="w-4 h-4" /> Response Rate
        </p>
        <p className="font-semibold text-lg">{responseRate}%</p>
      </div>
      
      <div className="space-y-1 text-center md:text-left">
        <p className="text-sm text-muted-foreground flex items-center justify-center md:justify-start gap-1.5">
          <Clock className="w-4 h-4" /> Response Time
        </p>
        <p className="font-semibold text-lg">{responseTime}</p>
      </div>
      
      <div className="space-y-1 text-center md:text-left">
        <p className="text-sm text-muted-foreground flex items-center justify-center md:justify-start gap-1.5">
          <CheckCircle className="w-4 h-4" /> On Time Delivery
        </p>
        <p className="font-semibold text-lg">{onTimeDelivery}%</p>
      </div>
    </div>
  );
}

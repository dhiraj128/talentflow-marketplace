"use client";

import { PageHeader } from "@/components/shared/PageHeader";
import { MetricCard } from "@/components/shared/MetricCard";
import { StatsGrid } from "@/components/shared/StatsGrid";
import { Shuffle, Zap, Target } from "lucide-react";

export default function AdminMatchingPage() {
  return (
    <div className="max-w-7xl mx-auto p-8 space-y-8">
      <PageHeader title="Matching Engine" description="Configure and monitor the AI matching algorithm" />
      <StatsGrid columns={3}>
        <MetricCard title="Matches Today" value="4,521" icon={<Shuffle className="w-4 h-4" />} trend="up" trendValue="+8%" />
        <MetricCard title="Avg Match Score" value="87%" icon={<Target className="w-4 h-4" />} trend="up" trendValue="+2%" />
        <MetricCard title="Engine Latency" value="124ms" icon={<Zap className="w-4 h-4" />} trend="down" trendValue="-5ms" />
      </StatsGrid>
      
      <div className="bg-card text-card-foreground p-6 rounded-xl border">
        <h3 className="text-lg font-semibold mb-4">Algorithm Tuning</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Skill Weight (%)</label>
            <input type="range" className="w-full" defaultValue={60} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Experience Weight (%)</label>
            <input type="range" className="w-full" defaultValue={30} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Location Weight (%)</label>
            <input type="range" className="w-full" defaultValue={10} />
          </div>
        </div>
      </div>
    </div>
  );
}

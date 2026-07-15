import React from "react";
import * as Icons from "lucide-react";
import { DashboardMetric } from "@/lib/types/enterprise";

export const MetricCard = React.memo(function MetricCard({ metric }: { metric: DashboardMetric }) {
  // @ts-expect-error Dynamic icon import
  const Icon = metric.iconName && Icons[metric.iconName] ? Icons[metric.iconName] : Icons.Activity;
  
  return (
    <div className="bg-[#162947]/50 border border-slate-700/50 rounded-2xl p-6 flex flex-col gap-4 group hover:bg-[#162947]/80 hover:border-slate-600 transition-colors w-full h-full">
      <div className="flex items-center gap-3 text-slate-400">
        <div className="p-2 rounded-lg bg-[#081526] group-hover:scale-110 transition-transform shrink-0">
          <Icon className="w-5 h-5 text-blue-400" />
        </div>
        <span className="text-sm font-semibold truncate">{metric.label}</span>
      </div>
      <div className="flex flex-col gap-1">
        <span className="text-3xl lg:text-4xl font-bold text-white truncate">{metric.value}</span>
        <span className={`text-sm font-bold ${metric.isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
          {metric.trend}
        </span>
      </div>
    </div>
  );
});

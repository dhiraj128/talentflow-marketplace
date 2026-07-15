import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export const KpiSkeleton = () => (
  <div className="bg-[#162947]/50 border border-slate-700/50 rounded-xl p-3 flex flex-col gap-1.5 h-[80px]">
    <div className="flex items-center gap-2">
      <Skeleton className="h-6 w-6 rounded-md bg-slate-700/50" />
      <Skeleton className="h-4 w-20 bg-slate-700/50" />
    </div>
    <div className="flex justify-between items-end mt-1">
      <Skeleton className="h-6 w-16 bg-slate-700/50" />
      <Skeleton className="h-3 w-8 bg-slate-700/50" />
    </div>
  </div>
);

export const ChartSkeleton = ({ className }: { className?: string }) => (
  <div className={`bg-[#162947]/50 border border-slate-700/50 rounded-xl p-4 flex flex-col justify-between ${className}`}>
    <Skeleton className="h-4 w-32 bg-slate-700/50 mb-4" />
    <Skeleton className="w-full flex-1 bg-slate-700/50 rounded-lg" />
  </div>
);

export const ActivitySkeleton = () => (
  <div className="bg-[#162947]/50 border border-slate-700/50 rounded-xl p-3 flex items-center gap-3">
    <Skeleton className="h-10 w-10 rounded-full bg-slate-700/50 shrink-0" />
    <div className="flex flex-col gap-1.5 w-full">
      <Skeleton className="h-3 w-3/4 bg-slate-700/50" />
      <Skeleton className="h-4 w-full bg-slate-700/50" />
    </div>
  </div>
);

export const TeamSkeleton = () => (
  <div className="bg-[#162947]/50 border border-slate-700/50 rounded-xl p-3 flex flex-col justify-center h-full">
    <Skeleton className="h-3 w-24 bg-slate-700/50 mb-3" />
    <div className="flex items-center justify-between">
      <div className="flex -space-x-3">
        {[1, 2, 3, 4, 5].map(i => (
          <Skeleton key={i} className="w-8 h-8 rounded-full border-2 border-[#162947] bg-slate-700/50" />
        ))}
      </div>
      <Skeleton className="h-7 w-7 rounded-full bg-slate-700/50" />
    </div>
  </div>
);

export const DashboardSkeleton = () => {
  return (
    <div className="flex-1 p-4 md:p-6 flex flex-col gap-4 md:gap-6 w-full">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <KpiSkeleton />
        <KpiSkeleton />
        <KpiSkeleton />
        <KpiSkeleton />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <ChartSkeleton className="md:col-span-2 h-[160px]" />
        <ChartSkeleton className="h-[160px]" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ActivitySkeleton />
        <TeamSkeleton />
      </div>
    </div>
  );
};

"use client";

import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { PageContainer } from "@/components/shared/PageContainer";

export function DashboardSkeleton() {
  return (
    <PageContainer>
      <div className="space-y-8 animate-pulse">
        {/* Welcome Header Skeleton */}
        <div className="h-32 sm:h-40 w-full bg-zinc-200 dark:bg-zinc-800 rounded-3xl" />
        
        {/* Career Journey Timeline Skeleton */}
        <div className="h-24 w-full bg-zinc-200 dark:bg-zinc-800 rounded-3xl" />
        
        {/* Stats Grid Skeleton */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
            <div key={i} className="h-28 bg-zinc-200 dark:bg-zinc-800 rounded-xl" />
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-8">
            {/* AI Match Engine Skeleton */}
            <div className="space-y-4">
              <Skeleton className="h-8 w-48" />
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="h-[280px] bg-zinc-200 dark:bg-zinc-800 rounded-xl" />
                <div className="h-[280px] bg-zinc-200 dark:bg-zinc-800 rounded-xl" />
              </div>
            </div>

            {/* Application Tracker Skeleton */}
            <div className="space-y-4">
              <Skeleton className="h-8 w-56" />
              <div className="h-[300px] bg-zinc-200 dark:bg-zinc-800 rounded-xl" />
            </div>
          </div>

          <div className="space-y-6">
            {/* Profile Completion Skeleton */}
            <div className="h-[320px] bg-zinc-200 dark:bg-zinc-800 rounded-xl" />
            
            {/* Resume Strength Skeleton */}
            <div className="h-[360px] bg-zinc-200 dark:bg-zinc-800 rounded-xl" />
          </div>
        </div>
      </div>
    </PageContainer>
  );
}

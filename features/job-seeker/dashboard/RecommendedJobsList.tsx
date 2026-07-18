"use client";

import React, { useState } from "react";
import { JobCard } from "@/components/shared/JobCard";
import { Button } from "@/components/ui/button";
import { LayoutGrid, List } from "lucide-react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

interface RecommendedJobsListProps {
  jobs: any[];
  isLoading?: boolean;
}

export function RecommendedJobsList({ jobs, isLoading = false }: RecommendedJobsListProps) {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-end">
          <Skeleton className="h-9 w-20" />
        </div>
        <div className={cn("grid gap-4", viewMode === "grid" ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1")}>
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-[200px] rounded-xl w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Recommended Jobs</h3>
        <div className="flex items-center gap-1 bg-zinc-100 dark:bg-zinc-800 p-1 rounded-lg">
          <Button 
            variant="ghost" 
            size="sm" 
            className={cn("h-7 px-2", viewMode === "grid" ? "bg-white dark:bg-zinc-700 shadow-sm" : "")}
            onClick={() => setViewMode("grid")}
          >
            <LayoutGrid className="w-4 h-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className={cn("h-7 px-2", viewMode === "list" ? "bg-white dark:bg-zinc-700 shadow-sm" : "")}
            onClick={() => setViewMode("list")}
          >
            <List className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {jobs.length === 0 ? (
        <div className="p-8 text-center bg-zinc-50 dark:bg-zinc-900/50 rounded-xl border border-dashed border-zinc-200 dark:border-zinc-800">
          <p className="text-muted-foreground">No recommended jobs found. Update your profile to get better matches.</p>
        </div>
      ) : (
        <div className={cn("grid gap-4", viewMode === "grid" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3" : "grid-cols-1")}>
          {jobs.map((job) => (
            <JobCard 
              key={job.id} 
              {...job} 
              company={job.employer?.companyName} 
            />
          ))}
        </div>
      )}
    </div>
  );
}

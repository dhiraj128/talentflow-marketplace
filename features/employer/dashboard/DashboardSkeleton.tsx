import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { PageContainer } from "@/components/shared/PageContainer";

export function DashboardSkeleton() {
  return (
    <PageContainer>
      <div className="space-y-8 pb-10">
        <Skeleton className="h-24 w-full rounded-2xl" />
        <Skeleton className="h-32 w-full rounded-2xl" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Skeleton className="h-28 w-full rounded-xl" />
          <Skeleton className="h-28 w-full rounded-xl" />
          <Skeleton className="h-28 w-full rounded-xl" />
          <Skeleton className="h-28 w-full rounded-xl" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-8">
            <Skeleton className="h-40 w-full rounded-xl" />
            <Skeleton className="h-[400px] w-full rounded-xl" />
          </div>
          <div className="space-y-6">
            <Skeleton className="h-[300px] w-full rounded-xl" />
            <Skeleton className="h-[300px] w-full rounded-xl" />
          </div>
        </div>
      </div>
    </PageContainer>
  );
}

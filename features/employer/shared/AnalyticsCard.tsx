import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

interface AnalyticsCardProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  isLoading?: boolean;
}

export function AnalyticsCard({ title, description, children, className, isLoading }: AnalyticsCardProps) {
  return (
    <Card className={cn("overflow-hidden flex flex-col", className)}>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent className="flex-1 min-h-[250px]">
        {isLoading ? (
          <div className="w-full h-full flex items-center justify-center">
            <Skeleton className="w-full h-full min-h-[200px]" />
          </div>
        ) : (
          children
        )}
      </CardContent>
    </Card>
  );
}

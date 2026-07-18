import React from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface HourlyRateBadgeProps {
  rate: number;
  className?: string;
}

export function HourlyRateBadge({ rate, className }: HourlyRateBadgeProps) {
  return (
    <Badge variant="secondary" className={cn("font-semibold text-sm", className)}>
      ${rate}<span className="text-muted-foreground font-normal text-xs ml-0.5">/hr</span>
    </Badge>
  );
}

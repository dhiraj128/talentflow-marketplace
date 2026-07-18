import React from "react";
import { Badge } from "@/components/ui/badge";
import { Clock, Calendar, CheckCircle, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface AvailabilityStatusProps {
  status: string; // e.g. "Full-time (30+ hrs/week)"
  isAvailable: boolean;
}

export function AvailabilityStatus({ status, isAvailable }: AvailabilityStatusProps) {
  const getIcon = () => {
    if (status.includes("Full-time")) return Clock;
    if (status.includes("Part-time")) return Calendar;
    if (status.includes("As needed")) return CheckCircle;
    return HelpCircle;
  };

  const Icon = getIcon();

  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
      <div className="flex items-center gap-2">
        <div className={cn("w-2 h-2 rounded-full", isAvailable ? "bg-green-500" : "bg-red-500")} />
        <span className="text-sm font-medium">{isAvailable ? "Available Now" : "Currently Unavailable"}</span>
      </div>
      <div className="hidden sm:block text-muted-foreground">•</div>
      <Badge variant="outline" className="font-normal flex items-center gap-1.5 w-fit">
        <Icon className="w-3 h-3 text-muted-foreground" />
        {status || "Availability not specified"}
      </Badge>
    </div>
  );
}

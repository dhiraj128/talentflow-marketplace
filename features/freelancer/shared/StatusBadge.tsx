import React from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { CheckCircle, Clock, XCircle, AlertCircle } from "lucide-react";

export type StatusType = "ACTIVE" | "PENDING" | "COMPLETED" | "CANCELLED" | "DRAFT";

interface StatusBadgeProps {
  status: StatusType;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  let config = {
    label: "Unknown",
    icon: AlertCircle,
    colorClass: "bg-slate-50 text-slate-700 border-slate-200"
  };

  switch (status) {
    case "ACTIVE":
      config = { label: "Active", icon: CheckCircle, colorClass: "bg-green-50 text-green-700 border-green-200" };
      break;
    case "PENDING":
      config = { label: "Pending", icon: Clock, colorClass: "bg-amber-50 text-amber-700 border-amber-200" };
      break;
    case "COMPLETED":
      config = { label: "Completed", icon: CheckCircle, colorClass: "bg-blue-50 text-blue-700 border-blue-200" };
      break;
    case "CANCELLED":
      config = { label: "Cancelled", icon: XCircle, colorClass: "bg-red-50 text-red-700 border-red-200" };
      break;
    case "DRAFT":
      config = { label: "Draft", icon: Clock, colorClass: "bg-slate-50 text-slate-700 border-slate-200" };
      break;
  }

  const Icon = config.icon;

  return (
    <Badge variant="outline" className={cn("gap-1 font-medium text-xs", config.colorClass, className)}>
      <Icon className="w-3 h-3" />
      {config.label}
    </Badge>
  );
}

import React from "react";
import { Badge } from "@/components/ui/badge";
import { Shield, ShieldAlert, Clock, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export type VerificationStatus = "PENDING" | "DOCUMENTS_SUBMITTED" | "UNDER_REVIEW" | "VERIFIED" | "REJECTED";

interface VerificationBadgeProps {
  status: VerificationStatus;
  className?: string;
  showIcon?: boolean;
}

export function VerificationBadge({ status, className, showIcon = true }: VerificationBadgeProps) {
  let config = {
    label: "Unknown",
    icon: Shield,
    colorClass: "bg-slate-100 text-slate-700 border-slate-200"
  };

  switch (status) {
    case "PENDING":
      config = {
        label: "Pending Verification",
        icon: Clock,
        colorClass: "bg-amber-50 text-amber-700 border-amber-200"
      };
      break;
    case "DOCUMENTS_SUBMITTED":
    case "UNDER_REVIEW":
      config = {
        label: "Under Review",
        icon: ShieldAlert,
        colorClass: "bg-blue-50 text-blue-700 border-blue-200"
      };
      break;
    case "VERIFIED":
      config = {
        label: "Verified Employer",
        icon: CheckCircle,
        colorClass: "bg-green-50 text-green-700 border-green-200"
      };
      break;
    case "REJECTED":
      config = {
        label: "Verification Failed",
        icon: ShieldAlert,
        colorClass: "bg-red-50 text-red-700 border-red-200"
      };
      break;
  }

  const Icon = config.icon;

  return (
    <Badge variant="outline" className={cn("gap-1 font-medium", config.colorClass, className)}>
      {showIcon && <Icon className="w-3.5 h-3.5" />}
      {config.label}
    </Badge>
  );
}

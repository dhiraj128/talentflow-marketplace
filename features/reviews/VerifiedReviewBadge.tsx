"use client";

import React from "react";
import { ShieldCheck, Building2, GraduationCap, Briefcase } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ReviewRelationshipType } from "@/lib/services/reviews.service";

interface VerifiedReviewBadgeProps {
  relationshipType: ReviewRelationshipType;
  className?: string;
}

export function VerifiedReviewBadge({ relationshipType, className }: VerifiedReviewBadgeProps) {
  const getBadgeConfig = () => {
    switch (relationshipType) {
      case "EMPLOYER_TO_CANDIDATE":
        return { label: "Verified Hire", icon: ShieldCheck, variant: "default" as const };
      case "CANDIDATE_TO_EMPLOYER":
        return { label: "Verified Employer", icon: Building2, variant: "secondary" as const };
      case "STUDENT_TO_COURSE":
      case "STUDENT_TO_TRAINER":
        return { label: "Verified Student", icon: GraduationCap, variant: "outline" as const };
      case "CLIENT_TO_FREELANCER":
      case "FREELANCER_TO_CLIENT":
        return { label: "Verified Client", icon: Briefcase, variant: "secondary" as const };
      default:
        return { label: "Verified Review", icon: ShieldCheck, variant: "default" as const };
    }
  };

  const { label, icon: Icon, variant } = getBadgeConfig();

  return (
    <Badge variant={variant} className={`inline-flex items-center gap-1.5 font-medium px-2.5 py-0.5 text-xs ${className}`}>
      <Icon className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
      <span>{label}</span>
    </Badge>
  );
}

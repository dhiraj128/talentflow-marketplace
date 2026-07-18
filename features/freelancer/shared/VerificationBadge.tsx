import React from "react";
import { ShieldCheck } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface VerificationBadgeProps {
  isVerified: boolean;
}

export function VerificationBadge({ isVerified }: VerificationBadgeProps) {
  if (!isVerified) return null;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger className="cursor-default focus:outline-none">
          <ShieldCheck className="w-4 h-4 text-blue-500 fill-blue-50" />
        </TooltipTrigger>
        <TooltipContent>
          <p>Identity Verified</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

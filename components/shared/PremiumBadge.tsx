import React from "react";
import { Badge } from "@/components/ui/badge";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface PremiumBadgeProps {
  className?: string;
  variant?: "default" | "free";
}

export function PremiumBadge({ className, variant = "default" }: PremiumBadgeProps) {
  if (variant === "free") {
    return (
      <Badge
        variant="outline"
        className={cn(
          "bg-slate-100 text-slate-700 border-slate-300 font-bold px-2 py-0.5 gap-1",
          className
        )}
      >
        FREE
      </Badge>
    );
  }

  return (
    <Badge
      variant="outline"
      className={cn(
        "bg-gradient-to-r from-amber-200 to-amber-500 text-amber-950 border-amber-400 font-bold px-2 py-0.5 gap-1 shadow-sm",
        className
      )}
    >
      <Sparkles className="w-3 h-3 fill-amber-700 text-amber-900" />
      PREMIUM
    </Badge>
  );
}

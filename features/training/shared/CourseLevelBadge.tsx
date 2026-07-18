import { cn } from "@/lib/utils";
import { Award } from "lucide-react";

interface CourseLevelBadgeProps {
  level: "Certificate" | "Specialization" | "Degree" | "Short Course";
  className?: string;
}

export function CourseLevelBadge({ level, className }: CourseLevelBadgeProps) {
  return (
    <div className={cn("inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold", className)}>
      <Award className="w-3.5 h-3.5" />
      {level}
    </div>
  );
}

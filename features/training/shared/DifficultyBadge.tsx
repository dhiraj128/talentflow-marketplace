import { cn } from "@/lib/utils";

interface DifficultyBadgeProps {
  level: "Beginner" | "Intermediate" | "Advanced";
  className?: string;
}

export function DifficultyBadge({ level, className }: DifficultyBadgeProps) {
  const styles = {
    Beginner: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
    Intermediate: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
    Advanced: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
  };

  return (
    <span className={cn("px-2.5 py-0.5 rounded-full text-xs font-medium", styles[level], className)}>
      {level}
    </span>
  );
}

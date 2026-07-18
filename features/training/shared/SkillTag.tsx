import { cn } from "@/lib/utils";

interface SkillTagProps {
  skill: string;
  className?: string;
}

export function SkillTag({ skill, className }: SkillTagProps) {
  return (
    <span className={cn("px-2.5 py-1 bg-secondary/50 hover:bg-secondary text-secondary-foreground text-xs font-medium rounded-md transition-colors", className)}>
      {skill}
    </span>
  );
}

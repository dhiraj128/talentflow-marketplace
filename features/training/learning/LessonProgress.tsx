import { Progress } from "@/components/ui/progress";

interface LessonProgressProps {
  progress: number;
  totalLessons: number;
  completedLessons: number;
}

export function LessonProgress({ progress, totalLessons, completedLessons }: LessonProgressProps) {
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-xs font-medium text-muted-foreground">
        <span>{completedLessons} of {totalLessons} lessons completed</span>
        <span>{Math.round(progress)}%</span>
      </div>
      <Progress value={progress} className="h-2" />
    </div>
  );
}

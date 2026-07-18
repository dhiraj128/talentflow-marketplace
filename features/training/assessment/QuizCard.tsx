import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, HelpCircle, AlertCircle } from "lucide-react";
import Link from "next/link";

interface QuizCardProps {
  id: string;
  courseId: string;
  title: string;
  description: string;
  durationMinutes: number;
  questionCount: number;
  passingScore: number;
  isUrgent?: boolean;
}

export function QuizCard({ id, courseId, title, description, durationMinutes, questionCount, passingScore, isUrgent }: QuizCardProps) {
  return (
    <Card className={`border ${isUrgent ? 'border-rose-200' : 'border-border/60'} hover:shadow-md transition-shadow`}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="font-bold text-lg mb-1">{title}</h3>
            <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>
          </div>
          {isUrgent && (
            <span className="shrink-0 flex items-center text-xs font-bold text-rose-600 bg-rose-100 px-2.5 py-1 rounded-full">
              <AlertCircle className="w-4 h-4 mr-1.5" /> Due Soon
            </span>
          )}
        </div>
        
        <div className="flex flex-wrap gap-4 text-sm font-medium text-muted-foreground mb-6">
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4" /> {durationMinutes} mins
          </div>
          <div className="flex items-center gap-1.5">
            <HelpCircle className="w-4 h-4" /> {questionCount} questions
          </div>
          <div className="flex items-center gap-1.5 px-2 py-0.5 bg-muted rounded-md text-foreground">
            Passing: {passingScore}%
          </div>
        </div>
        
        <div className="flex gap-3">
          <Link href={`/job-seeker/learning/${courseId}/assessment`} className="flex-1">
            <Button className="w-full bg-indigo-600 hover:bg-indigo-700">Start Assessment</Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

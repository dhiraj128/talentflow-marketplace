import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, RotateCcw, ArrowRight } from "lucide-react";
import Link from "next/link";
import { ProgressRing } from "../shared/ProgressRing";

interface QuizResultsProps {
  score: number;
  totalQuestions: number;
  passingScore: number;
  courseId: string;
}

export function QuizResults({ score, totalQuestions, passingScore, courseId }: QuizResultsProps) {
  const percentage = (score / totalQuestions) * 100;
  const passed = percentage >= passingScore;

  return (
    <div className="max-w-2xl mx-auto py-12 text-center">
      <Card className="border-border/60 shadow-lg overflow-hidden">
        <div className={`p-8 ${passed ? 'bg-green-50 dark:bg-green-900/20' : 'bg-rose-50 dark:bg-rose-900/20'}`}>
          <div className="flex justify-center mb-6">
            {passed ? (
              <CheckCircle2 className="w-20 h-20 text-green-500" />
            ) : (
              <XCircle className="w-20 h-20 text-rose-500" />
            )}
          </div>
          
          <h2 className="text-3xl font-bold mb-2">
            {passed ? "Congratulations! You Passed" : "Keep Trying! You Didn't Pass"}
          </h2>
          <p className="text-muted-foreground text-lg">
            You scored {score} out of {totalQuestions} questions correctly.
          </p>
        </div>
        
        <CardContent className="p-8">
          <div className="flex justify-center mb-8">
            <ProgressRing 
              progress={percentage} 
              size={120} 
              strokeWidth={8}
              color={passed ? "text-green-500" : "text-rose-500"}
              className="text-2xl"
            />
          </div>
          
          <div className="bg-muted p-4 rounded-lg mb-8 text-sm">
            <p className="font-medium">Passing score: {passingScore}%</p>
            <p className="text-muted-foreground mt-1">Your score: {percentage.toFixed(0)}%</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {!passed && (
              <Button variant="outline" className="gap-2" onClick={() => window.location.reload()}>
                <RotateCcw className="w-4 h-4" /> Retake Assessment
              </Button>
            )}
            
            <Link href={`/job-seeker/learning/${courseId}`}>
              <Button className={`gap-2 w-full sm:w-auto ${passed ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'}`}>
                Continue Course <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

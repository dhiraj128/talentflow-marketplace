import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Target, Clock, Award } from "lucide-react";
import { ProgressRing } from "../shared/ProgressRing";

export function AssessmentSummary() {
  return (
    <div className="grid md:grid-cols-3 gap-6 mb-8">
      <Card className="border-border/60">
        <CardContent className="p-6 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">Average Score</p>
            <h3 className="text-3xl font-bold">88%</h3>
          </div>
          <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-500 flex items-center justify-center">
            <Target className="w-6 h-6" />
          </div>
        </CardContent>
      </Card>
      
      <Card className="border-border/60">
        <CardContent className="p-6 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">Assessments Passed</p>
            <h3 className="text-3xl font-bold">12 <span className="text-lg text-muted-foreground font-medium">/ 14</span></h3>
          </div>
          <div className="w-12 h-12 rounded-full bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-500 flex items-center justify-center">
            <Award className="w-6 h-6" />
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/60">
        <CardContent className="p-6 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">Time Spent</p>
            <h3 className="text-3xl font-bold">14h <span className="text-lg text-muted-foreground font-medium">30m</span></h3>
          </div>
          <div className="w-12 h-12 rounded-full bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-500 flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

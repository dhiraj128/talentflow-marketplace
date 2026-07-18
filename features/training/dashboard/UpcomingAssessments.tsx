import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, FileText, AlertCircle, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export function UpcomingAssessments() {
  const assessments = [
    {
      id: "a1",
      courseId: "react-adv",
      title: "Mid-Term: Hooks Deep Dive",
      courseName: "Advanced React Patterns & Architecture",
      dueDate: "Tomorrow, 11:59 PM",
      duration: "45 mins",
      type: "Quiz",
      urgent: true,
    },
    {
      id: "a2",
      courseId: "node-api",
      title: "Module 1 Assessment",
      courseName: "Node.js Microservices Masterclass",
      dueDate: "Oct 24, 2026",
      duration: "30 mins",
      type: "Test",
      urgent: false,
    }
  ];

  return (
    <Card className="flex flex-col h-full border-muted/60">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-bold flex items-center gap-2">
          <FileText className="w-5 h-5 text-indigo-500" />
          Upcoming Assessments
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col gap-4">
        {assessments.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-6 text-muted-foreground">
            <CheckCircle2 className="w-12 h-12 text-muted-foreground/30 mb-2" />
            <p>You have no upcoming assessments.</p>
          </div>
        ) : (
          assessments.map((a) => (
            <div key={a.id} className={`p-4 rounded-lg border ${a.urgent ? 'border-rose-200 bg-rose-50/50 dark:border-rose-900/50 dark:bg-rose-900/10' : 'border-border bg-card'}`}>
              <div className="flex justify-between items-start gap-4 mb-2">
                <div>
                  <h4 className="font-semibold text-sm line-clamp-1">{a.title}</h4>
                  <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">{a.courseName}</p>
                </div>
                {a.urgent && (
                  <span className="shrink-0 flex items-center text-[10px] uppercase font-bold tracking-wider text-rose-600 bg-rose-100 px-2 py-0.5 rounded-full">
                    <AlertCircle className="w-3 h-3 mr-1" /> Due Soon
                  </span>
                )}
              </div>
              
              <div className="flex items-center gap-4 text-xs font-medium text-muted-foreground mb-4">
                <span className="flex items-center gap-1.5 text-foreground">
                  <Clock className="w-3.5 h-3.5 text-indigo-500" /> {a.dueDate}
                </span>
                <span>•</span>
                <span>{a.duration}</span>
                <span>•</span>
                <span>{a.type}</span>
              </div>
              
              <Link href={`/job-seeker/learning/${a.courseId}/assessment`}>
                <Button variant={a.urgent ? "default" : "outline"} className={`w-full ${a.urgent ? 'bg-indigo-600 hover:bg-indigo-700' : ''}`} size="sm">
                  Start Assessment
                </Button>
              </Link>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}

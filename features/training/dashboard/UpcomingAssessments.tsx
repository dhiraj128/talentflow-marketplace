import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, FileText, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import api from "@/lib/api";

export function UpcomingAssessments() {
  const [assessments, setAssessments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAssessments();
  }, []);

  const fetchAssessments = async () => {
    setIsLoading(true);
    try {
      const res = await api.get('/assessments').catch(() => null);
      const list = Array.isArray(res?.data) ? res.data : res?.data?.data || [];
      setAssessments(list);
    } catch (e) {
      console.warn("Failed to load upcoming assessments", e);
      setAssessments([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="flex flex-col h-full border-muted/60">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-bold flex items-center gap-2">
          <FileText className="w-5 h-5 text-indigo-500" />
          Upcoming Assessments
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col gap-4">
        {isLoading ? (
          <div className="p-6 text-center text-muted-foreground">Loading assessments...</div>
        ) : assessments.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-6 text-muted-foreground">
            <CheckCircle2 className="w-12 h-12 text-muted-foreground/30 mb-2" />
            <p>You have no upcoming assessments.</p>
          </div>
        ) : (
          assessments.map((a) => (
            <div key={a.id} className="p-4 rounded-lg border border-border bg-card">
              <div className="flex justify-between items-start gap-4 mb-2">
                <div>
                  <h4 className="font-semibold text-sm line-clamp-1">{a.title || "Assessment"}</h4>
                  <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">{a.courseName || a.category || "General"}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs font-medium text-muted-foreground mb-4">
                <span className="flex items-center gap-1.5 text-foreground">
                  <Clock className="w-3.5 h-3.5 text-indigo-500" /> {a.dueDate || "Available Now"}
                </span>
                <span>•</span>
                <span>{a.durationMinutes || 30} mins</span>
              </div>

              <Link href={`/job-seeker/assessments`}>
                <Button variant="default" className="w-full bg-indigo-600 hover:bg-indigo-700" size="sm">
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

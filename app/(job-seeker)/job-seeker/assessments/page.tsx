"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Clock, XCircle, PlayCircle, BookOpen, ClipboardList } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { EmptyState } from "@/components/shared/EmptyState";
import api from "@/lib/api";

interface Assessment {
  id: string;
  title: string;
  description: string;
  category: string;
  durationMinutes: number;
  status: "Passed" | "Failed" | "Pending" | "Available";
  score?: number;
}

export default function AssessmentsPage() {
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAssessments();
  }, []);

  const fetchAssessments = async () => {
    setIsLoading(true);
    try {
      const res = await api.get('/assessments').catch(() => null);
      const list = Array.isArray(res?.data) ? res.data : res?.data?.data || [];
      const formatted = list.map((a: any) => ({
        id: a.id,
        title: a.title || "Skill Assessment",
        description: a.description || "Validate your skills to stand out to employers.",
        category: a.category || "General",
        durationMinutes: a.durationMinutes || 30,
        status: a.status || "Available",
        score: a.score,
      }));
      setAssessments(formatted);
    } catch (e) {
      console.warn("Failed to load assessments", e);
      setAssessments([]);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: Assessment["status"]) => {
    switch (status) {
      case "Passed": return <Badge className="bg-green-500/10 text-green-500 border-green-500/20 hover:bg-green-500/20" variant="outline"><CheckCircle2 className="w-3 h-3 mr-1" /> Passed</Badge>;
      case "Failed": return <Badge className="bg-red-500/10 text-red-500 border-red-500/20 hover:bg-red-500/20" variant="outline"><XCircle className="w-3 h-3 mr-1" /> Failed</Badge>;
      case "Pending": return <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20 hover:bg-amber-500/20" variant="outline"><Clock className="w-3 h-3 mr-1" /> Pending</Badge>;
      default: return <Badge className="bg-blue-500/10 text-blue-500 border-blue-500/20 hover:bg-blue-500/20" variant="outline"><PlayCircle className="w-3 h-3 mr-1" /> Available</Badge>;
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Skill Assessments</h1>
        <p className="text-muted-foreground mt-2">
          Validate your skills by taking tests. Top scores will highlight your profile to top employers.
        </p>
      </div>

      {isLoading ? (
        <div className="p-8 text-center text-muted-foreground">Loading skill assessments...</div>
      ) : assessments.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {assessments.map((assessment) => (
            <Card key={assessment.id} className="flex flex-col">
              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                  <Badge variant="secondary">{assessment.category}</Badge>
                  {getStatusBadge(assessment.status)}
                </div>
                <CardTitle className="text-xl">{assessment.title}</CardTitle>
                <CardDescription className="line-clamp-2">{assessment.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <div className="flex items-center text-sm text-muted-foreground mb-4">
                  <Clock className="w-4 h-4 mr-2" />
                  {assessment.durationMinutes} Minutes
                </div>

                {assessment.score !== undefined && (
                  <div className="space-y-2 mt-4">
                    <div className="flex justify-between text-sm">
                      <span>Score</span>
                      <span className="font-medium">{assessment.score}%</span>
                    </div>
                    <Progress value={assessment.score} className="h-2" />
                  </div>
                )}
              </CardContent>
              <CardFooter className="border-t pt-4">
                {assessment.status === "Available" && (
                  <Button className="w-full gap-2">
                    <PlayCircle className="w-4 h-4" /> Start Assessment
                  </Button>
                )}
                {assessment.status === "Pending" && (
                  <Button className="w-full gap-2" variant="outline">
                    <BookOpen className="w-4 h-4" /> Resume Assessment
                  </Button>
                )}
                {assessment.status === "Passed" && (
                  <Button className="w-full gap-2" variant="ghost" disabled>
                    Completed
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<ClipboardList className="h-10 w-10 text-muted-foreground" />}
          title="No skill assessments available yet"
          description="Assessments will appear here as they are published by course trainers and administrators."
        />
      )}
    </div>
  );
}

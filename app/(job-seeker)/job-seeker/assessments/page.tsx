"use client";

import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Clock, XCircle, PlayCircle, BookOpen } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface Assessment {
  id: string;
  title: string;
  description: string;
  category: string;
  durationMinutes: number;
  status: "Passed" | "Failed" | "Pending" | "Available";
  score?: number;
}

const assessments: Assessment[] = [
  {
    id: "a1",
    title: "Advanced React Patterns",
    description: "Test your knowledge on hooks, context, performance optimization, and advanced patterns.",
    category: "Frontend",
    durationMinutes: 45,
    status: "Passed",
    score: 92
  },
  {
    id: "a2",
    title: "TypeScript Fundamentals",
    description: "Core concepts of TypeScript including types, interfaces, generics, and utility types.",
    category: "Frontend",
    durationMinutes: 30,
    status: "Passed",
    score: 88
  },
  {
    id: "a3",
    title: "System Design Basics",
    description: "Evaluate your understanding of scalable architectures and system design principles.",
    category: "Architecture",
    durationMinutes: 60,
    status: "Failed",
    score: 55
  },
  {
    id: "a4",
    title: "Node.js API Development",
    description: "Build and secure RESTful APIs using Node.js, Express, and database integrations.",
    category: "Backend",
    durationMinutes: 50,
    status: "Pending"
  },
  {
    id: "a5",
    title: "UI/UX Principles",
    description: "Assess your eye for design, accessibility, and user experience best practices.",
    category: "Design",
    durationMinutes: 40,
    status: "Available"
  },
  {
    id: "a6",
    title: "Cloud Infrastructure (AWS)",
    description: "Deployments, serverless, and foundational AWS services.",
    category: "DevOps",
    durationMinutes: 60,
    status: "Available"
  }
];

export default function AssessmentsPage() {
  const getStatusBadge = (status: Assessment["status"]) => {
    switch (status) {
      case "Passed": return <Badge className="bg-green-500/10 text-green-500 border-green-500/20 hover:bg-green-500/20" variant="outline"><CheckCircle2 className="w-3 h-3 mr-1" /> Passed</Badge>;
      case "Failed": return <Badge className="bg-red-500/10 text-red-500 border-red-500/20 hover:bg-red-500/20" variant="outline"><XCircle className="w-3 h-3 mr-1" /> Failed</Badge>;
      case "Pending": return <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20 hover:bg-amber-500/20" variant="outline"><Clock className="w-3 h-3 mr-1" /> Pending</Badge>;
      case "Available": return <Badge className="bg-blue-500/10 text-blue-500 border-blue-500/20 hover:bg-blue-500/20" variant="outline"><PlayCircle className="w-3 h-3 mr-1" /> Available</Badge>;
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Skill Assessments</h1>
        <p className="text-muted-foreground mt-2">
          Validate your skills by taking tests. Top scores will highlight your profile to top employers.
        </p>
      </div>

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
              
              {assessment.status === "Passed" && assessment.score && (
                <div className="space-y-2 mt-4">
                  <div className="flex justify-between text-sm">
                    <span>Score</span>
                    <span className="font-medium text-green-500">{assessment.score}%</span>
                  </div>
                  <Progress value={assessment.score} className="h-2" />
                </div>
              )}
              {assessment.status === "Failed" && assessment.score && (
                <div className="space-y-2 mt-4">
                  <div className="flex justify-between text-sm">
                    <span>Score</span>
                    <span className="font-medium text-red-500">{assessment.score}%</span>
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
              {assessment.status === "Failed" && (
                <Button className="w-full gap-2" variant="outline">
                  Retake Assessment
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
    </div>
  );
}

"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { FileCheck, Sparkles, Layout, ScanText, ArrowUpRight } from "lucide-react";
import Link from "next/link";

interface ResumeStrengthWidgetProps {
  atsScore: number;
  completeness: number;
  keywordOptimization: string;
  suggestions: string[];
}

export function ResumeStrengthWidget({
  atsScore,
  completeness,
  keywordOptimization,
  suggestions
}: ResumeStrengthWidgetProps) {
  
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-500 bg-emerald-500/10";
    if (score >= 60) return "text-amber-500 bg-amber-500/10";
    return "text-rose-500 bg-rose-500/10";
  };

  const getScoreProgressColor = (score: number) => {
    if (score >= 80) return "bg-emerald-500";
    if (score >= 60) return "bg-amber-500";
    return "bg-rose-500";
  };

  return (
    <Card className="h-full bg-white/50 dark:bg-zinc-900/50 backdrop-blur-xl border-zinc-200/50 dark:border-zinc-800/50 overflow-hidden relative group">
      <div className="absolute top-0 right-0 p-24 bg-purple-500/5 rounded-full blur-3xl -mr-12 -mt-12 pointer-events-none group-hover:bg-purple-500/10 transition-colors duration-500" />
      
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <FileCheck className="w-5 h-5 text-purple-500" />
          Resume Strength
        </CardTitle>
        <CardDescription>Your resume performance metrics based on recent scans</CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <span className="text-sm font-medium text-muted-foreground">ATS Score</span>
            <div className={`text-2xl font-bold px-3 py-1 rounded-lg w-fit ${getScoreColor(atsScore)}`}>
              {atsScore}/100
            </div>
          </div>
          <div className="space-y-1">
            <span className="text-sm font-medium text-muted-foreground">Keywords</span>
            <div className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 pt-1">
              {keywordOptimization}
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="font-medium text-zinc-700 dark:text-zinc-300">Completeness</span>
            <span className="font-bold">{completeness}%</span>
          </div>
          <Progress 
            value={completeness} 
            className="h-2" 
            indicatorClassName={getScoreProgressColor(completeness)} 
          />
        </div>

        {suggestions.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-semibold flex items-center gap-1.5 text-zinc-900 dark:text-zinc-100">
              <Sparkles className="w-4 h-4 text-purple-500" /> Improvement Ideas
            </h4>
            <ul className="text-sm space-y-1.5 text-muted-foreground">
              {suggestions.map((suggestion, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <div className="min-w-1.5 h-1.5 rounded-full bg-purple-500 mt-1.5" />
                  <span className="leading-tight">{suggestion}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="pt-2 flex flex-col gap-2">
          <Link href="/job-seeker/resume-center/builder">
            <Button className="w-full bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-white dark:text-zinc-900">
              <Layout className="w-4 h-4 mr-2" />
              Open Resume Builder
            </Button>
          </Link>
          <div className="grid grid-cols-2 gap-2">
            <Link href="/job-seeker/resume-center/ats">
              <Button variant="outline" className="w-full text-xs sm:text-sm px-2">
                <ScanText className="w-4 h-4 mr-1 sm:mr-2" />
                Run Scanner
              </Button>
            </Link>
            <Link href="/job-seeker/resume-center">
              <Button variant="outline" className="w-full text-xs sm:text-sm px-2">
                Manage <ArrowUpRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

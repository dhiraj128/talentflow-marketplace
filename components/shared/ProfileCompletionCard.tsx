"use client";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";

interface ProfileCompletionCardProps {
  progress?: number;
  missingFields?: string[];
  score?: number;
  missingItems?: { label: string; href?: string }[];
  [key: string]: any;
}

export function ProfileCompletionCard({ progress, missingFields, score, missingItems, ...rest }: ProfileCompletionCardProps) {
  const displayProgress = progress ?? score ?? 0;
  const displayMissing = missingFields ?? (missingItems ? missingItems.map(m => m.label) : []);
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Profile Completion</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between text-sm">
          <span className="font-medium text-muted-foreground">Complete your profile to stand out</span>
          <span className="font-bold">{displayProgress}%</span>
        </div>
        <Progress value={displayProgress} className="h-2" />
        {displayMissing.length > 0 && (
          <div className="pt-2">
            <p className="text-xs text-muted-foreground mb-2">Missing information:</p>
            <ul className="text-sm space-y-1">
              {displayMissing.map((field, i) => (
                <li key={i} className="flex items-center gap-2 text-amber-600 dark:text-amber-500">
                  <div className="h-1.5 w-1.5 rounded-full bg-current" />
                  {field}
                </li>
              ))}
            </ul>
            <Button variant="outline" size="sm" className="w-full mt-4">Complete Profile</Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

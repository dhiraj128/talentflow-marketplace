"use client";

import React from "react";
import { CourseCard } from "@/components/shared/CourseCard";
import { Button } from "@/components/ui/button";
import { GraduationCap, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";

interface LearningRecommendationsPanelProps {
  courses: any[];
  isLoading?: boolean;
}

export function LearningRecommendationsPanel({ courses, isLoading = false }: LearningRecommendationsPanelProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-24" />
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-[250px] rounded-xl w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <GraduationCap className="w-5 h-5 text-indigo-500" />
          Learning Recommendations
        </h3>
        <Link href="/find-courses">
          <Button variant="link" className="text-sm h-auto p-0">
            Browse All <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </Link>
      </div>

      {courses.length === 0 ? (
        <div className="p-8 text-center bg-indigo-50 dark:bg-indigo-950/20 rounded-xl border border-dashed border-indigo-200 dark:border-indigo-800">
          <p className="text-muted-foreground">No course recommendations at this time.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {courses.map((course) => (
            <CourseCard 
              key={course.id} 
              {...course} 
              price={`$${course.price || '49.99'}`} 
            />
          ))}
        </div>
      )}
    </div>
  );
}

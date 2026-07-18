"use client";

import { PageContainer } from "@/components/shared/PageContainer";
import { QuizPlayer } from "@/features/training/assessment/QuizPlayer";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

export default function AssessmentPage({ params }: { params: { courseId: string } }) {
  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border/60 bg-card">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center">
          <Link href={`/job-seeker/learning/${params.courseId}`}>
            <Button variant="ghost" size="sm" className="gap-2">
              <ChevronLeft className="w-4 h-4" /> Back to Course
            </Button>
          </Link>
        </div>
      </div>
      <PageContainer className="py-8">
        <QuizPlayer courseId={params.courseId} />
      </PageContainer>
    </div>
  );
}

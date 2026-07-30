"use client";

import { useQuery } from "@tanstack/react-query";
import { courseService } from "@/lib/services/course.service";
import { LearningPlayer } from "@/features/training/learning/LearningPlayer";
import { Skeleton } from "@/components/ui/skeleton";

export default function LearningPlayerPage({ params }: { params: { courseId: string } }) {
  const { data: course, isLoading } = useQuery({
    queryKey: ["learningCourse", params.courseId],
    queryFn: async () => {
      try {
        return await courseService.getCourse(params.courseId);
      } catch (err) {
        return null;
      }
    }
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background pt-24 p-8 max-w-7xl mx-auto space-y-4">
        <Skeleton className="h-12 w-3/4" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  const courseTitle = course?.title || "Course Player";
  const curriculum = (course?.modules || []).map((m: any, idx: number) => ({
    title: m.title || `Module ${idx + 1}`,
    lessons: (m.lessons || []).map((l: any) => ({
      id: l.id,
      title: l.title || "Lesson",
      duration: l.duration || "10:00",
      type: l.type || "video",
      completed: false
    }))
  }));

  return (
    <div className="min-h-screen bg-background pt-16">
      <LearningPlayer 
        courseId={params.courseId} 
        courseTitle={courseTitle} 
        curriculum={curriculum} 
      />
    </div>
  );
}

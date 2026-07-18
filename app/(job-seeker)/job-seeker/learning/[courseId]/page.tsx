"use client";

import { LearningPlayer } from "@/features/training/learning/LearningPlayer";

export default function LearningPlayerPage({ params }: { params: { courseId: string } }) {
  // Mock course curriculum
  const courseTitle = "Advanced React Patterns & Architecture";
  const curriculum = [
    {
      title: "Module 1: Introduction to Advanced Patterns",
      lessons: [
        { id: "lesson-1", title: "Course Overview & Setup", duration: "10:25", type: "video", completed: true },
        { id: "lesson-2", title: "Thinking in React: Re-evaluated", duration: "15:30", type: "video", completed: false },
        { id: "lesson-3", title: "Component Design Principles", duration: "12:45", type: "text", completed: false },
        { id: "lesson-4", title: "Module 1 Assessment", duration: "15:00", type: "assessment", completed: false }
      ]
    },
    {
      title: "Module 2: State Management Architecture",
      lessons: [
        { id: "lesson-5", title: "Context API Deep Dive", duration: "25:10", type: "video", completed: false },
        { id: "lesson-6", title: "When to use Redux vs Zustand", duration: "20:15", type: "video", completed: false },
        { id: "lesson-7", title: "Server State with React Query", duration: "32:40", type: "video", completed: false }
      ]
    }
  ];

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

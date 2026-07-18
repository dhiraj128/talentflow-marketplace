"use client";

import { useState } from "react";
import { LessonSidebar } from "./LessonSidebar";
import { LessonContent } from "./LessonContent";
import { LessonNavigation } from "./LessonNavigation";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LearningPlayerProps {
  courseId: string;
  courseTitle: string;
  curriculum: any[];
}

export function LearningPlayer({ courseId, courseTitle, curriculum }: LearningPlayerProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeLessonId, setActiveLessonId] = useState<string>("lesson-1");

  // Flatten lessons for navigation
  const allLessons = curriculum.flatMap(section => section.lessons);
  const currentIndex = allLessons.findIndex(l => l.id === activeLessonId);
  const currentLesson = allLessons[currentIndex];
  
  const hasNext = currentIndex < allLessons.length - 1;
  const hasPrev = currentIndex > 0;

  const handleNext = () => {
    if (hasNext) setActiveLessonId(allLessons[currentIndex + 1].id);
  };

  const handlePrev = () => {
    if (hasPrev) setActiveLessonId(allLessons[currentIndex - 1].id);
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] bg-background relative overflow-hidden">
      {/* Mobile Sidebar Toggle */}
      <Button 
        variant="outline" 
        size="icon" 
        className="absolute top-4 left-4 z-50 lg:hidden shadow-md bg-background/80 backdrop-blur-md"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </Button>

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-40 w-80 bg-card border-r border-border/60 shadow-xl lg:shadow-none lg:static lg:block transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <LessonSidebar 
          courseTitle={courseTitle}
          curriculum={curriculum} 
          activeLessonId={activeLessonId} 
          onSelectLesson={(id) => {
            setActiveLessonId(id);
            setSidebarOpen(false);
          }} 
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden h-full">
        <div className="flex-1 overflow-y-auto p-4 lg:p-8 pb-24">
          <LessonContent lesson={currentLesson} courseId={courseId} />
        </div>
        
        <div className="shrink-0 bg-card border-t border-border/60">
          <LessonNavigation 
            hasPrev={hasPrev} 
            hasNext={hasNext} 
            onPrev={handlePrev} 
            onNext={handleNext} 
          />
        </div>
      </div>
    </div>
  );
}

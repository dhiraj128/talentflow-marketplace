"use client";

import { useState } from "react";
import { PlayCircle, FileText, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface CurriculumAccordionProps {
  curriculum: any[];
}

export function CurriculumAccordion({ curriculum }: CurriculumAccordionProps) {
  const [openSections, setOpenSections] = useState<number[]>([0]);

  const toggleSection = (index: number) => {
    if (openSections.includes(index)) {
      setOpenSections(openSections.filter((i) => i !== index));
    } else {
      setOpenSections([...openSections, index]);
    }
  };

  const totalLectures = curriculum.reduce((acc, section) => acc + section.lessons.length, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Course Content</h2>
        <div className="text-sm font-medium text-muted-foreground">
          {curriculum.length} sections • {totalLectures} lectures
        </div>
      </div>

      <div className="border border-border/60 rounded-xl overflow-hidden divide-y divide-border/60">
        {curriculum.map((section, idx) => {
          const isOpen = openSections.includes(idx);
          
          return (
            <div key={idx} className="bg-card">
              <button
                onClick={() => toggleSection(idx)}
                className="w-full flex items-center justify-between p-4 bg-muted/20 hover:bg-muted/40 transition-colors text-left"
              >
                <div>
                  <h4 className="font-bold">{section.title}</h4>
                  <div className="text-xs text-muted-foreground mt-1 font-medium">
                    {section.lessons.length} lectures • {section.duration}
                  </div>
                </div>
                {isOpen ? (
                  <ChevronUp className="w-5 h-5 text-muted-foreground shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-muted-foreground shrink-0" />
                )}
              </button>
              
              {isOpen && (
                <div className="p-4 space-y-3 bg-background animate-in slide-in-from-top-2">
                  {section.lessons.map((lesson: any, lessonIdx: number) => (
                    <div key={lessonIdx} className="flex items-start justify-between group">
                      <div className="flex gap-3">
                        {lesson.type === "video" ? (
                          <PlayCircle className="w-4 h-4 mt-0.5 text-muted-foreground group-hover:text-blue-600 transition-colors shrink-0" />
                        ) : (
                          <FileText className="w-4 h-4 mt-0.5 text-muted-foreground group-hover:text-indigo-600 transition-colors shrink-0" />
                        )}
                        <span className="text-sm font-medium group-hover:text-blue-600 transition-colors">
                          {lesson.title}
                        </span>
                      </div>
                      <div className="text-xs text-muted-foreground shrink-0 pl-4">{lesson.duration}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

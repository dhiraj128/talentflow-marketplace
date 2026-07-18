import { PlayCircle, FileText, CheckCircle2, ChevronDown, ChevronUp } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface LessonSidebarProps {
  courseTitle: string;
  curriculum: any[];
  activeLessonId: string;
  onSelectLesson: (id: string) => void;
}

export function LessonSidebar({ courseTitle, curriculum, activeLessonId, onSelectLesson }: LessonSidebarProps) {
  const [openSections, setOpenSections] = useState<number[]>([0]);

  const toggleSection = (idx: number) => {
    if (openSections.includes(idx)) {
      setOpenSections(openSections.filter(i => i !== idx));
    } else {
      setOpenSections([...openSections, idx]);
    }
  };

  return (
    <div className="flex flex-col h-full bg-card">
      <div className="p-6 border-b border-border/60">
        <h2 className="font-bold text-lg leading-tight line-clamp-2">{courseTitle}</h2>
        <div className="mt-4">
          <div className="flex justify-between text-xs font-medium mb-1.5">
            <span>Course Progress</span>
            <span>25%</span>
          </div>
          <Progress value={25} className="h-1.5" />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="divide-y divide-border/40">
          {curriculum.map((section, idx) => {
            const isOpen = openSections.includes(idx);
            return (
              <div key={idx}>
                <button
                  onClick={() => toggleSection(idx)}
                  className="w-full flex items-center justify-between p-4 bg-muted/10 hover:bg-muted/30 transition-colors text-left"
                >
                  <div>
                    <h4 className="font-semibold text-sm leading-tight">{section.title}</h4>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      {section.lessons.filter((l: any) => l.completed).length} / {section.lessons.length} completed
                    </div>
                  </div>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-muted-foreground shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />
                  )}
                </button>
                
                {isOpen && (
                  <div className="bg-background">
                    {section.lessons.map((lesson: any) => {
                      const isActive = activeLessonId === lesson.id;
                      return (
                        <button
                          key={lesson.id}
                          onClick={() => onSelectLesson(lesson.id)}
                          className={cn(
                            "w-full flex items-start gap-3 p-4 pl-6 text-left transition-colors border-l-2",
                            isActive 
                              ? "bg-blue-50/50 dark:bg-blue-900/10 border-blue-600" 
                              : "border-transparent hover:bg-muted/30"
                          )}
                        >
                          <div className="mt-0.5 shrink-0">
                            {lesson.completed ? (
                              <CheckCircle2 className="w-4 h-4 text-green-500" />
                            ) : lesson.type === "video" ? (
                              <PlayCircle className={isActive ? "w-4 h-4 text-blue-600" : "w-4 h-4 text-muted-foreground"} />
                            ) : (
                              <FileText className={isActive ? "w-4 h-4 text-blue-600" : "w-4 h-4 text-muted-foreground"} />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h5 className={cn("text-sm line-clamp-2 leading-tight", isActive ? "font-semibold text-foreground" : "font-medium text-muted-foreground")}>
                              {lesson.title}
                            </h5>
                            <div className="text-xs text-muted-foreground mt-1">{lesson.duration}</div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

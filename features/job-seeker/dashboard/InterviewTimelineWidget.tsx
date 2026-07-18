"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarDays, Clock, Video, MapPin, Building2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface Interview {
  id: string;
  companyName: string;
  roleTitle: string;
  date: string;
  time: string;
  type: "Video Call" | "In-Person" | "Phone";
  status: "Upcoming" | "Completed";
}

interface InterviewTimelineWidgetProps {
  interviews: Interview[];
}

export function InterviewTimelineWidget({ interviews }: InterviewTimelineWidgetProps) {
  return (
    <Card className="h-full bg-white/50 dark:bg-zinc-900/50 backdrop-blur-xl border-zinc-200/50 dark:border-zinc-800/50">
      <CardHeader className="pb-4 border-b border-zinc-100 dark:border-zinc-800">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <CalendarDays className="w-5 h-5 text-amber-500" />
          Interview Timeline
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        {interviews.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-muted-foreground text-sm">No interviews scheduled yet.</p>
          </div>
        ) : (
          <div className="relative border-l border-zinc-200 dark:border-zinc-700 ml-3 space-y-6 pb-2">
            {interviews.map((interview, idx) => {
              const isUpcoming = interview.status === "Upcoming";
              
              return (
                <div key={interview.id} className="relative pl-6">
                  {/* Timeline Dot */}
                  <div 
                    className={cn(
                      "absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full ring-4 ring-white dark:ring-zinc-950",
                      isUpcoming ? "bg-amber-500" : "bg-zinc-300 dark:bg-zinc-600"
                    )}
                  />
                  
                  <div className={cn(
                    "rounded-xl border p-4 space-y-3 transition-colors",
                    isUpcoming 
                      ? "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 shadow-sm" 
                      : "bg-zinc-50 dark:bg-zinc-900/30 border-transparent text-muted-foreground"
                  )}>
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-2">
                      <div>
                        <h4 className={cn("font-semibold text-sm", isUpcoming ? "text-zinc-900 dark:text-zinc-100" : "text-zinc-500")}>
                          {interview.roleTitle}
                        </h4>
                        <div className="flex items-center gap-1.5 text-xs mt-1">
                          <Building2 className="w-3.5 h-3.5" />
                          <span>{interview.companyName}</span>
                        </div>
                      </div>
                      <Badge variant={isUpcoming ? "default" : "secondary"} className={cn(
                        "text-[10px] uppercase tracking-wider",
                        isUpcoming ? "bg-amber-500 hover:bg-amber-600 text-white" : ""
                      )}>
                        {interview.status}
                      </Badge>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs">
                      <div className="flex items-center gap-1.5 text-zinc-600 dark:text-zinc-400">
                        <CalendarDays className="w-3.5 h-3.5" />
                        <span>{interview.date}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-zinc-600 dark:text-zinc-400">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{interview.time}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-zinc-600 dark:text-zinc-400">
                        {interview.type === "In-Person" ? (
                          <MapPin className="w-3.5 h-3.5" />
                        ) : (
                          <Video className="w-3.5 h-3.5" />
                        )}
                        <span>{interview.type}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

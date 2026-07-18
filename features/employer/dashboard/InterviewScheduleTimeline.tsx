import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Video, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export interface Interview {
  id: string;
  candidateName: string;
  position: string;
  date: string;
  time: string;
  type: "Video Call" | "Phone" | "In-Person";
  status: "Upcoming" | "Completed";
}

interface InterviewScheduleTimelineProps {
  interviews: Interview[];
}

export function InterviewScheduleTimeline({ interviews }: InterviewScheduleTimelineProps) {
  if (!interviews || interviews.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Interview Schedule</CardTitle>
      </CardHeader>
      <CardContent className="px-6 pb-6 pt-0">
        <div className="space-y-6">
          {interviews.map((interview, i) => (
            <div key={interview.id} className="relative pl-6">
              {/* Timeline line */}
              {i !== interviews.length - 1 && (
                <div className="absolute left-[11px] top-7 bottom-[-24px] w-px bg-border" />
              )}
              {/* Timeline dot */}
              <div className="absolute left-0 top-1.5 h-6 w-6 rounded-full border-2 border-background bg-primary shadow-sm flex items-center justify-center">
                <Calendar className="w-3 h-3 text-primary-foreground" />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold text-sm">{interview.candidateName}</h4>
                    <p className="text-xs text-muted-foreground">{interview.position}</p>
                  </div>
                  <Badge variant={interview.status === "Upcoming" ? "default" : "outline"} className="text-[10px]">
                    {interview.status}
                  </Badge>
                </div>
                <div className="flex gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {interview.date}</span>
                  <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {interview.time}</span>
                  <span className="flex items-center gap-1"><Video className="w-3.5 h-3.5" /> {interview.type}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

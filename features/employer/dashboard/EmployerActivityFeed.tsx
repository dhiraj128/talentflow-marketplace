import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase, UserCheck, CalendarCheck, FileCheck, CheckCircle } from "lucide-react";

interface Activity {
  id: string;
  type: "JOB_POSTED" | "CANDIDATE_APPLIED" | "SHORTLISTED" | "INTERVIEW_SCHEDULED" | "OFFER_SENT";
  title: string;
  timestamp: string;
}

interface EmployerActivityFeedProps {
  activities: Activity[];
}

export function EmployerActivityFeed({ activities }: EmployerActivityFeedProps) {
  if (!activities || activities.length === 0) return null;

  const getIcon = (type: Activity["type"]) => {
    switch (type) {
      case "JOB_POSTED": return <Briefcase className="w-4 h-4 text-blue-500" />;
      case "CANDIDATE_APPLIED": return <FileCheck className="w-4 h-4 text-purple-500" />;
      case "SHORTLISTED": return <UserCheck className="w-4 h-4 text-indigo-500" />;
      case "INTERVIEW_SCHEDULED": return <CalendarCheck className="w-4 h-4 text-orange-500" />;
      case "OFFER_SENT": return <CheckCircle className="w-4 h-4 text-green-500" />;
      default: return <CheckCircle className="w-4 h-4 text-muted-foreground" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Activity Feed</CardTitle>
      </CardHeader>
      <CardContent className="px-6 pb-6 pt-0 space-y-4">
        {activities.map(activity => (
          <div key={activity.id} className="flex items-start gap-3">
            <div className="mt-0.5 p-1.5 rounded-md bg-muted/50 border">
              {getIcon(activity.type)}
            </div>
            <div>
              <p className="text-sm font-medium">{activity.title}</p>
              <p className="text-xs text-muted-foreground">{activity.timestamp}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

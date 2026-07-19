import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase, FileCheck, CheckCircle, Star, DollarSign } from "lucide-react";

interface Activity {
  id: string;
  type: "PROJECT_STARTED" | "MILESTONE_APPROVED" | "PAYMENT_RECEIVED" | "NEW_REVIEW" | "BID_ACCEPTED";
  title: string;
  timestamp: string;
}

interface ActivityFeedProps {
  activities: Activity[];
}

export function ActivityFeed({ activities }: ActivityFeedProps) {
  if (!activities || activities.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent className="px-6 pb-6 pt-0 flex flex-col items-center justify-center text-center">
          <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center mb-3">
            <CheckCircle className="w-5 h-5 text-muted-foreground opacity-50" />
          </div>
          <p className="text-sm font-medium text-muted-foreground">No recent activity</p>
          <p className="text-xs text-muted-foreground/60 mt-1">Actions on your projects will appear here.</p>
        </CardContent>
      </Card>
    );
  }

  const getIcon = (type: Activity["type"]) => {
    switch (type) {
      case "PROJECT_STARTED": return <Briefcase className="w-4 h-4 text-blue-500" />;
      case "MILESTONE_APPROVED": return <CheckCircle className="w-4 h-4 text-indigo-500" />;
      case "PAYMENT_RECEIVED": return <DollarSign className="w-4 h-4 text-emerald-500" />;
      case "NEW_REVIEW": return <Star className="w-4 h-4 text-yellow-500" />;
      case "BID_ACCEPTED": return <FileCheck className="w-4 h-4 text-purple-500" />;
      default: return <CheckCircle className="w-4 h-4 text-muted-foreground" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
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

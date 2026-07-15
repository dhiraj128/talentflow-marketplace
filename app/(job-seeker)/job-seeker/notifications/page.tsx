"use client";

import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Bell, Briefcase, Star, MessageSquare } from "lucide-react";

const NOTIFICATIONS = [
  { id: 1, title: "Application Viewed", description: "TechCorp Inc. has viewed your application for Senior React Developer.", time: "2 hours ago", icon: Briefcase, color: "text-blue-500", read: false },
  { id: 2, title: "New Message", description: "Sarah from StartupHub sent you a message regarding your application.", time: "5 hours ago", icon: MessageSquare, color: "text-green-500", read: false },
  { id: 3, title: "Profile Match", description: "You're a 95% match for a new role at InnovateTech.", time: "1 day ago", icon: Star, color: "text-amber-500", read: true },
];

export default function NotificationsPage() {
  return (
    <div className="max-w-7xl mx-auto p-8 space-y-8">
      <PageHeader 
        title="Notifications" 
        description="Stay updated on your job search progress"
      />

      <div className="space-y-4">
        {NOTIFICATIONS.map((notification) => (
          <Card key={notification.id} className={notification.read ? "bg-muted/50" : "bg-card"}>
            <CardContent className="flex items-start gap-4 p-4">
              <div className={`p-2 rounded-full bg-background border ${notification.color}`}>
                <notification.icon className="h-5 w-5" />
              </div>
              <div className="flex-1 space-y-1">
                <p className={`text-sm font-medium ${!notification.read ? "text-foreground" : ""}`}>{notification.title}</p>
                <p className="text-sm text-muted-foreground">{notification.description}</p>
                <p className="text-xs text-muted-foreground pt-1">{notification.time}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

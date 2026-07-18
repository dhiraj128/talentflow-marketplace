import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell, Sparkles, Calendar, ShieldCheck, Mail } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Notification {
  id: string;
  type: "NEW_APPLICATION" | "AI_MATCH" | "INTERVIEW_REMINDER" | "VERIFICATION" | "ADMIN_MESSAGE";
  title: string;
  message: string;
  time: string;
  isRead: boolean;
}

interface EmployerNotificationsProps {
  notifications: Notification[];
}

export function EmployerNotifications({ notifications }: EmployerNotificationsProps) {
  if (!notifications || notifications.length === 0) return null;

  const getIcon = (type: Notification["type"]) => {
    switch (type) {
      case "NEW_APPLICATION": return <Bell className="w-4 h-4 text-blue-500" />;
      case "AI_MATCH": return <Sparkles className="w-4 h-4 text-purple-500" />;
      case "INTERVIEW_REMINDER": return <Calendar className="w-4 h-4 text-orange-500" />;
      case "VERIFICATION": return <ShieldCheck className="w-4 h-4 text-green-500" />;
      case "ADMIN_MESSAGE": return <Mail className="w-4 h-4 text-slate-500" />;
      default: return <Bell className="w-4 h-4 text-muted-foreground" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Notifications
          {notifications.some(n => !n.isRead) && (
            <Badge variant="default" className="text-xs">
              {notifications.filter(n => !n.isRead).length} New
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="px-6 pb-6 pt-0 space-y-4">
        {notifications.map(notification => (
          <div key={notification.id} className={`flex items-start gap-3 p-3 rounded-lg transition-colors ${notification.isRead ? "bg-transparent" : "bg-muted/30"}`}>
            <div className="mt-0.5">
              {getIcon(notification.type)}
            </div>
            <div>
              <p className={`text-sm ${notification.isRead ? "font-medium" : "font-semibold"}`}>
                {notification.title}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">{notification.message}</p>
              <p className="text-[10px] text-muted-foreground mt-1 uppercase tracking-wider">{notification.time}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

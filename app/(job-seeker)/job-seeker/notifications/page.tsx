"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Bell, Briefcase, Star, MessageSquare } from "lucide-react";
import { notificationService } from "@/lib/services/notification.service";
import { useAuth } from "@/lib/auth-context";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDistanceToNow } from "date-fns";

export default function NotificationsPage() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      if (!user?.id) return;
      try {
        setLoading(true);
        setError(null);
        const data = await notificationService.getNotifications({ userId: user.id });
        setNotifications(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to load notifications", err);
        setError("Failed to load notifications. Please try again later.");
        setNotifications([]);
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, [user]);

  const getIconData = (title: string) => {
    const t = title.toLowerCase();
    if (t.includes("application") || t.includes("job")) {
      return { icon: Briefcase, color: "text-blue-500" };
    }
    if (t.includes("message")) {
      return { icon: MessageSquare, color: "text-green-500" };
    }
    if (t.includes("match")) {
      return { icon: Star, color: "text-amber-500" };
    }
    return { icon: Bell, color: "text-primary" };
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-8 space-y-8">
      <PageHeader 
        title="Notifications" 
        description="Stay updated on your job search progress"
      />

      {error ? (
        <div className="bg-destructive/10 text-destructive p-4 rounded-lg text-center">
          {error}
        </div>
      ) : loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent className="flex items-start gap-4 p-4">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-1/3" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-3 w-20 pt-1" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : notifications.length === 0 ? (
        <Card className="bg-muted/30 border-dashed">
          <CardContent className="flex flex-col items-center justify-center p-12 text-center">
            <div className="bg-background p-4 rounded-full mb-4 shadow-sm">
              <Bell className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No Notifications Yet</h3>
            <p className="text-muted-foreground max-w-sm">
              You're all caught up! We'll notify you when employers view your application or send you messages.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {notifications.map((notification) => {
            const { icon: Icon, color } = getIconData(notification.title);
            return (
              <Card key={notification.id} className={notification.isRead ? "bg-muted/50" : "bg-card"}>
                <CardContent className="flex flex-col sm:flex-row sm:items-start gap-4 p-4">
                  <div className={`p-2 rounded-full bg-background border self-start ${color}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className={`text-sm font-medium ${!notification.isRead ? "text-foreground" : ""}`}>
                      {notification.title}
                    </p>
                    <p className="text-sm text-muted-foreground">{notification.message}</p>
                    <p className="text-xs text-muted-foreground pt-1">
                      {notification.createdAt ? formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true }) : ''}
                    </p>
                  </div>
                  {!notification.isRead && (
                    <div className="self-end sm:self-center mt-2 sm:mt-0">
                      <span className="h-2.5 w-2.5 rounded-full bg-blue-500 inline-block" />
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

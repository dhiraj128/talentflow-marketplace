"use client";

import React, { useEffect, useState, useCallback } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bell, Briefcase, Star, MessageSquare, RefreshCw, CheckCircle2 } from "lucide-react";
import { notificationService } from "@/lib/services/notification.service";
import { useAuth } from "@/lib/auth-context";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";

interface NotificationItem {
  id: string;
  title?: string;
  message?: string;
  isRead?: boolean;
  createdAt?: string;
  link?: string;
  url?: string;
}

export default function NotificationsPage() {
  const { user, loading: authLoading } = useAuth();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNotifications = useCallback(async () => {
    const userId = user?.id || (user as any)?.profile?.id;
    if (!userId) {
      if (!authLoading) setLoading(false);
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const data = await notificationService.getNotifications({ userId });
      const safeData = Array.isArray(data) ? data.filter(Boolean) : [];
      setNotifications(safeData);
    } catch (err: any) {
      console.error("Failed to load notifications:", err);
      setError("Unable to load notifications. Please check your connection and try again.");
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  }, [user, authLoading]);

  useEffect(() => {
    if (!authLoading) {
      fetchNotifications();
    }
  }, [authLoading, fetchNotifications]);

  const handleMarkAsRead = async (id: string) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
      toast.success("Notification marked as read");
    } catch (err) {
      console.error("Failed to mark as read:", err);
    }
  };

  const getIconData = (title?: string) => {
    if (!title) return { icon: Bell, color: "text-primary" };
    const t = String(title).toLowerCase();
    if (t.includes("application") || t.includes("job")) {
      return { icon: Briefcase, color: "text-blue-500" };
    }
    if (t.includes("message")) {
      return { icon: MessageSquare, color: "text-green-500" };
    }
    if (t.includes("match") || t.includes("recommended")) {
      return { icon: Star, color: "text-amber-500" };
    }
    return { icon: Bell, color: "text-primary" };
  };

  const formatNotificationTime = (dateStr?: string) => {
    if (!dateStr) return "Recently";
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return "Recently";
      return formatDistanceToNow(date, { addSuffix: true });
    } catch {
      return "Recently";
    }
  };

  const isInitialLoading = authLoading || loading;

  return (
    <div className="w-full max-w-full min-w-0 space-y-6 p-4 sm:p-8">
      <PageHeader 
        title="Notifications" 
        description="Stay updated on your job search progress and application status."
      />

      {error ? (
        <Card className="border border-destructive/20 bg-destructive/5 shadow-sm">
          <CardContent className="flex flex-col items-center justify-center p-8 sm:p-12 text-center space-y-4">
            <div className="p-3 bg-destructive/10 rounded-full text-destructive">
              <Bell className="h-6 w-6" />
            </div>
            <div className="space-y-1 max-w-md">
              <h3 className="font-semibold text-base text-foreground">Unable to load notifications</h3>
              <p className="text-xs sm:text-sm text-muted-foreground">{error}</p>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => fetchNotifications()} 
              className="gap-2 min-h-[40px] px-5"
            >
              <RefreshCw className="h-4 w-4" /> Try Again
            </Button>
          </CardContent>
        </Card>
      ) : isInitialLoading ? (
        <div className="space-y-3 w-full">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="border border-border shadow-sm">
              <CardContent className="flex items-start gap-4 p-4">
                <Skeleton className="h-10 w-10 rounded-full shrink-0" />
                <div className="flex-1 space-y-2 min-w-0">
                  <Skeleton className="h-4 w-1/3" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-3 w-20" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : notifications.length === 0 ? (
        <Card className="bg-muted/20 border-2 border-dashed border-border shadow-sm">
          <CardContent className="flex flex-col items-center justify-center p-10 sm:p-14 text-center">
            <div className="bg-background p-4 rounded-full mb-4 shadow-sm border border-border">
              <Bell className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-1 text-foreground">No Notifications Yet</h3>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-sm">
              You're all caught up! We'll notify you when employers view your applications or send you messages.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3 w-full">
          {notifications.map((notification, idx) => {
            if (!notification) return null;
            const notifId = notification.id || `notif-${idx}`;
            const title = notification.title || "Notification";
            const message = notification.message || "";
            const { icon: Icon, color } = getIconData(title);
            const timeAgo = formatNotificationTime(notification.createdAt);

            return (
              <Card 
                key={notifId} 
                className={`transition-colors border border-border ${
                  notification.isRead ? "bg-muted/30" : "bg-card shadow-sm border-l-4 border-l-primary"
                }`}
              >
                <CardContent className="flex flex-col sm:flex-row sm:items-start gap-3.5 p-4">
                  <div className={`p-2 rounded-lg bg-background border shrink-0 self-start ${color}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1 space-y-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className={`text-xs sm:text-sm font-semibold truncate ${!notification.isRead ? "text-foreground" : "text-muted-foreground"}`}>
                        {title}
                      </p>
                      <span className="text-[11px] text-muted-foreground shrink-0">{timeAgo}</span>
                    </div>
                    {message && (
                      <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2">{message}</p>
                    )}
                  </div>
                  {!notification.isRead && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleMarkAsRead(notifId)}
                      className="self-end sm:self-center text-xs h-8 px-2 text-muted-foreground hover:text-primary shrink-0"
                      title="Mark as read"
                    >
                      <CheckCircle2 className="h-4 w-4" />
                    </Button>
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

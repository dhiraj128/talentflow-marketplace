"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { notificationService, NotificationItem } from "@/lib/services/notification.service";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
  Bell,
  CheckCheck,
  Trash2,
  ExternalLink,
  Search,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Briefcase,
  Calendar,
  GraduationCap,
  ShieldAlert,
  FileText,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { toast } from "sonner";

interface NotificationCenterProps {
  role?: string;
}

export function NotificationCenter({ role }: NotificationCenterProps) {
  const router = useRouter();
  const { user } = useAuth();
  const userRole = role || user?.role || "CANDIDATE";

  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await notificationService.getNotifications({
        page,
        limit: 15,
        unreadOnly: filter === "unread",
      });
      setNotifications(res.data || []);
      setTotal(res.total || 0);
      setTotalPages(res.totalPages || 1);
      setUnreadCount(res.unreadCount || 0);
    } catch (err: any) {
      console.error("Failed to load notifications:", err);
      setError("Unable to load notifications. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }, [page, filter]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const handleMarkAsRead = async (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    try {
      await notificationService.markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
      toast.success("Marked as read");
    } catch (err) {
      console.error("Failed to mark read:", err);
      toast.error("Failed to update notification");
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
      toast.success("All notifications marked as read");
    } catch (err) {
      console.error("Failed to mark all as read:", err);
      toast.error("Failed to update notifications");
    }
  };

  const handleDelete = async (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    try {
      await notificationService.deleteNotification(id);
      setNotifications((prev) => prev.filter((n) => n.id !== id));
      setTotal((prev) => Math.max(0, prev - 1));
      toast.success("Notification removed");
    } catch (err) {
      console.error("Failed to delete notification:", err);
      toast.error("Failed to delete notification");
    }
  };

  const resolveTargetUrl = (n: NotificationItem): string => {
    if (n.link) return n.link;
    if (n.url) return n.url;

    const text = (n.title + " " + n.message).toLowerCase();
    const roleNormalized = userRole.toUpperCase();

    if (text.includes("application")) {
      return roleNormalized === "EMPLOYER" ? "/employer/applications" : "/job-seeker/applications";
    }
    if (text.includes("interview")) {
      return roleNormalized === "EMPLOYER" ? "/employer/interviews" : "/job-seeker/interviews";
    }
    if (text.includes("job")) {
      return roleNormalized === "EMPLOYER" ? "/employer/jobs" : "/find-jobs";
    }
    if (text.includes("course")) {
      return roleNormalized === "TRAINER" ? "/trainer/courses" : "/find-courses";
    }
    if (text.includes("password") || text.includes("security")) {
      switch (roleNormalized) {
        case "EMPLOYER": return "/employer/settings";
        case "TRAINER": return "/trainer/settings";
        case "ADMIN": return "/admin/settings";
        default: return "/job-seeker/settings";
      }
    }

    switch (roleNormalized) {
      case "EMPLOYER": return "/employer/dashboard";
      case "FREELANCER": return "/freelancer/dashboard";
      case "TRAINER": return "/trainer/dashboard";
      case "ADMIN": return "/admin/dashboard";
      default: return "/job-seeker/dashboard";
    }
  };

  const handleNotificationClick = async (n: NotificationItem) => {
    if (!n.isRead) {
      await handleMarkAsRead(n.id);
    }
    const targetUrl = resolveTargetUrl(n);
    router.push(targetUrl);
  };

  const getNotificationIcon = (n: NotificationItem) => {
    const text = (n.title + " " + n.message).toLowerCase();
    if (text.includes("application")) return <FileText className="h-5 w-5 text-blue-500" />;
    if (text.includes("interview")) return <Calendar className="h-5 w-5 text-purple-500" />;
    if (text.includes("job")) return <Briefcase className="h-5 w-5 text-emerald-500" />;
    if (text.includes("course")) return <GraduationCap className="h-5 w-5 text-amber-500" />;
    if (text.includes("security") || text.includes("password")) return <ShieldAlert className="h-5 w-5 text-red-500" />;
    return <Bell className="h-5 w-5 text-primary" />;
  };

  const filteredNotifications = notifications.filter((n) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return n.title.toLowerCase().includes(q) || n.message.toLowerCase().includes(q);
  });

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-6">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">Notification Center</h1>
            {unreadCount > 0 && (
              <Badge variant="destructive" className="px-2.5 py-0.5 text-xs font-semibold rounded-full">
                {unreadCount} unread
              </Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Stay updated with real-time alerts for applications, interviews, jobs, and account activity.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchNotifications}
            disabled={loading}
            className="flex items-center gap-1.5"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          {unreadCount > 0 && (
            <Button
              variant="secondary"
              size="sm"
              onClick={handleMarkAllAsRead}
              className="flex items-center gap-1.5"
            >
              <CheckCheck className="h-4 w-4 text-primary" />
              Mark all as read
            </Button>
          )}
        </div>
      </div>

      {/* Controls & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <Tabs
          value={filter}
          onValueChange={(val) => {
            setFilter(val as any);
            setPage(1);
          }}
          className="w-full sm:w-auto"
        >
          <TabsList className="grid w-full sm:w-auto grid-cols-2">
            <TabsTrigger value="all">All Notifications</TabsTrigger>
            <TabsTrigger value="unread" className="relative">
              Unread Only
              {unreadCount > 0 && (
                <span className="ml-1.5 rounded-full bg-primary/20 text-primary px-1.5 py-0.2 text-[10px] font-bold">
                  {unreadCount}
                </span>
              )}
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search notifications..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 text-sm"
          />
        </div>
      </div>

      {/* Content State Handling */}
      {loading && notifications.length === 0 ? (
        <Card className="p-8">
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-start gap-4 p-4 rounded-lg border bg-card animate-pulse">
                <div className="h-10 w-10 rounded-full bg-muted" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-1/3 bg-muted rounded" />
                  <div className="h-3 w-3/4 bg-muted rounded" />
                </div>
              </div>
            ))}
          </div>
        </Card>
      ) : error ? (
        <Card className="p-8 text-center border-destructive/20 bg-destructive/5">
          <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-foreground mb-1">Failed to load notifications</h3>
          <p className="text-sm text-muted-foreground mb-4">{error}</p>
          <Button onClick={fetchNotifications} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" /> Try Again
          </Button>
        </Card>
      ) : filteredNotifications.length === 0 ? (
        <Card className="p-12 text-center border-dashed">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted mx-auto mb-4">
            <CheckCircle2 className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-1">
            {filter === "unread" ? "No unread notifications" : "No notifications yet"}
          </h3>
          <p className="text-sm text-muted-foreground max-w-sm mx-auto mb-6">
            {filter === "unread"
              ? "You've read all your notifications. Great job!"
              : "When you receive applications, interview invites, or status updates, they will appear here."}
          </p>
          {filter === "unread" && (
            <Button variant="outline" onClick={() => setFilter("all")}>
              View All Notifications
            </Button>
          )}
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredNotifications.map((n) => (
            <div
              key={n.id}
              onClick={() => handleNotificationClick(n)}
              className={`group flex items-start gap-4 p-4 rounded-xl border transition-all cursor-pointer ${
                !n.isRead
                  ? "bg-card border-l-4 border-l-primary shadow-sm hover:shadow-md hover:border-primary/50"
                  : "bg-muted/30 border-border hover:bg-card hover:shadow-sm"
              }`}
            >
              {/* Icon */}
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-background border shadow-xs">
                {getNotificationIcon(n)}
              </div>

              {/* Text Body */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <h4 className={`text-sm font-semibold truncate ${!n.isRead ? "text-foreground font-bold" : "text-muted-foreground"}`}>
                    {n.title}
                  </h4>
                  <span className="text-xs text-muted-foreground shrink-0 font-medium">
                    {formatDate(n.createdAt)}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed line-clamp-2">
                  {n.message}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-1 shrink-0 opacity-80 group-hover:opacity-100 transition-opacity">
                {!n.isRead && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => handleMarkAsRead(n.id, e)}
                    title="Mark as read"
                    className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10"
                  >
                    <CheckCheck className="h-4 w-4" />
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => handleDelete(n.id, e)}
                  title="Delete notification"
                  className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
                <ExternalLink className="h-4 w-4 text-muted-foreground ml-1" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t pt-4">
          <p className="text-xs sm:text-sm text-muted-foreground">
            Page <span className="font-semibold text-foreground">{page}</span> of{" "}
            <span className="font-semibold text-foreground">{totalPages}</span> ({total} total)
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1 || loading}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              <ChevronLeft className="h-4 w-4 mr-1" /> Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages || loading}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            >
              Next <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

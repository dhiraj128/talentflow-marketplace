"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ActivityFeed } from "@/components/shared/ActivityFeed";
import { Bell, Activity, Sparkles, CheckCircle2, MessageSquare, Briefcase } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface Notification {
  id: string;
  type: "AI_MATCH" | "INTERVIEW_REMINDER" | "MESSAGE" | "APPLICATION_UPDATE" | "COURSE_REC";
  title: string;
  description: string;
  time: string;
  isRead: boolean;
  link?: string;
}

interface ActivityAndNotificationsProps {
  activities: any[];
  notifications: Notification[];
}

export function ActivityAndNotifications({ activities, notifications }: ActivityAndNotificationsProps) {
  
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "AI_MATCH":
        return <div className="p-2 rounded-full bg-purple-100 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400"><Sparkles className="w-4 h-4" /></div>;
      case "INTERVIEW_REMINDER":
        return <div className="p-2 rounded-full bg-amber-100 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400"><Bell className="w-4 h-4" /></div>;
      case "MESSAGE":
        return <div className="p-2 rounded-full bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400"><MessageSquare className="w-4 h-4" /></div>;
      case "APPLICATION_UPDATE":
        return <div className="p-2 rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400"><Briefcase className="w-4 h-4" /></div>;
      default:
        return <div className="p-2 rounded-full bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"><CheckCircle2 className="w-4 h-4" /></div>;
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <Card className="h-full bg-white/50 dark:bg-zinc-900/50 backdrop-blur-xl border-zinc-200/50 dark:border-zinc-800/50">
      <Tabs defaultValue="notifications" className="w-full">
        <CardHeader className="pb-4 border-b border-zinc-100 dark:border-zinc-800">
          <TabsList className="w-full grid grid-cols-2 bg-zinc-100 dark:bg-zinc-800">
            <TabsTrigger value="notifications" className="data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-950">
              Notifications
              {unreadCount > 0 && (
                <Badge variant="secondary" className="ml-2 bg-primary text-primary-foreground hover:bg-primary px-1.5 min-w-[20px] h-5 flex items-center justify-center">
                  {unreadCount}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="activity" className="data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-950">
              Activity
            </TabsTrigger>
          </TabsList>
        </CardHeader>
        <CardContent className="p-0">
          
          <TabsContent value="notifications" className="m-0 focus-visible:ring-0">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                <Bell className="w-8 h-8 mx-auto mb-3 text-zinc-300 dark:text-zinc-700" />
                <p className="text-sm">You're all caught up!</p>
              </div>
            ) : (
              <div className="flex flex-col divide-y divide-zinc-100 dark:divide-zinc-800 max-h-[400px] overflow-y-auto no-scrollbar">
                {notifications.map((notif) => (
                  <div key={notif.id} className={cn("p-4 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors flex gap-3", !notif.isRead && "bg-blue-50/30 dark:bg-blue-900/10")}>
                    <div className="shrink-0 pt-0.5">
                      {getNotificationIcon(notif.type)}
                    </div>
                    <div className="flex-grow min-w-0">
                      <div className="flex justify-between items-start gap-2">
                        <p className={cn("text-sm font-medium", !notif.isRead ? "text-zinc-900 dark:text-zinc-100" : "text-zinc-700 dark:text-zinc-300")}>
                          {notif.title}
                        </p>
                        <span className="text-xs text-muted-foreground whitespace-nowrap shrink-0">{notif.time}</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{notif.description}</p>
                      {notif.link && (
                        <Link href={notif.link}>
                          <Button variant="link" size="sm" className="h-auto p-0 text-xs mt-2 text-primary">
                            View details
                          </Button>
                        </Link>
                      )}
                    </div>
                    {!notif.isRead && (
                      <div className="shrink-0 w-2 h-2 rounded-full bg-primary mt-2" />
                    )}
                  </div>
                ))}
              </div>
            )}
            <div className="p-2 border-t border-zinc-100 dark:border-zinc-800 text-center">
              <Button variant="ghost" size="sm" className="w-full text-xs text-muted-foreground">Mark all as read</Button>
            </div>
          </TabsContent>

          <TabsContent value="activity" className="m-0 focus-visible:ring-0 p-4">
            {activities.length > 0 ? (
              <div className="max-h-[400px] overflow-y-auto no-scrollbar pr-2">
                <ActivityFeed items={activities} />
              </div>
            ) : (
              <div className="p-8 text-center text-muted-foreground">
                <Activity className="w-8 h-8 mx-auto mb-3 text-zinc-300 dark:text-zinc-700" />
                <p className="text-sm">No recent activity.</p>
              </div>
            )}
          </TabsContent>
          
        </CardContent>
      </Tabs>
    </Card>
  );
}

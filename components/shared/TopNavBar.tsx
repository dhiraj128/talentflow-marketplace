"use client";

import React from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";
import { useEffect, useState, useCallback } from "react";
import { notificationService, NotificationItem } from "@/lib/services/notification.service";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger,
  DropdownMenuGroup
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bell, Menu, LogOut, FileText, Calendar, Briefcase, GraduationCap, ShieldAlert } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

interface TopNavBarProps {
  onMenuClick?: () => void;
  showSidebarToggle?: boolean;
}

export function TopNavBar({ onMenuClick, showSidebarToggle = false }: TopNavBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [bellOpen, setBellOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setBellOpen(false);
  }, [pathname]);

  const fetchNotificationData = useCallback(async () => {
    if (!user) return;
    try {
      const res = await notificationService.getNotifications({ limit: 10 });
      setNotifications(res.data || []);
      setUnreadCount(res.unreadCount || 0);
    } catch (error) {
      console.error("Failed to load notifications in TopNavBar", error);
    }
  }, [user]);

  useEffect(() => {
    fetchNotificationData();
    const interval = setInterval(fetchNotificationData, 30000); // 30s polling for real-time feel
    return () => clearInterval(interval);
  }, [fetchNotificationData]);

  const markAsRead = async (id: string) => {
    if (!id) return;
    try {
      await notificationService.markAsRead(id);
      setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (e) {
      console.error("Failed to mark as read", e);
    }
  };

  const markAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (e) {
      console.error("Failed to mark all as read", e);
    }
  };

  const resolveTargetUrl = (n: NotificationItem): string => {
    if (n.link) return n.link;
    if (n.url) return n.url;

    const text = (n.title + " " + n.message).toLowerCase();
    const roleNormalized = (user?.role || "CANDIDATE").toUpperCase();

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
      case "EMPLOYER": return "/employer/notifications";
      case "FREELANCER": return "/freelancer/notifications";
      case "TRAINER": return "/trainer/notifications";
      case "ADMIN": return "/admin/notifications";
      default: return "/job-seeker/notifications";
    }
  };

  const handleNotificationClick = async (n: NotificationItem) => {
    if (!n.isRead) {
      await markAsRead(n.id);
    }
    const targetUrl = resolveTargetUrl(n);
    router.push(targetUrl);
  };

  const getRoleBasePath = (role?: string | null) => {
    switch (role?.toUpperCase()) {
      case "ADMIN": return "/admin";
      case "EMPLOYER": return "/employer";
      case "FREELANCER": return "/freelancer";
      case "TRAINER": return "/trainer";
      case "JOB_SEEKER":
      case "CANDIDATE": return "/job-seeker";
      default: return "/job-seeker";
    }
  };

  const getNotificationIcon = (n: NotificationItem) => {
    const text = (n.title + " " + n.message).toLowerCase();
    if (text.includes("application")) return <FileText className="h-4 w-4 text-blue-500 shrink-0" />;
    if (text.includes("interview")) return <Calendar className="h-4 w-4 text-purple-500 shrink-0" />;
    if (text.includes("job")) return <Briefcase className="h-4 w-4 text-emerald-500 shrink-0" />;
    if (text.includes("course")) return <GraduationCap className="h-4 w-4 text-amber-500 shrink-0" />;
    if (text.includes("security") || text.includes("password")) return <ShieldAlert className="h-4 w-4 text-red-500 shrink-0" />;
    return <Bell className="h-4 w-4 text-primary shrink-0" />;
  };

  const basePath = getRoleBasePath(user?.role);
  const dashboardHref = `${basePath}/dashboard`;
  const settingsHref = `${basePath}/settings`;

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="w-full min-w-0 px-4 flex h-16 items-center justify-between">
        <div className="flex items-center gap-4 flex-shrink-0">
          {showSidebarToggle && (
            <Button variant="ghost" size="icon" onClick={onMenuClick} className="md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle Sidebar</span>
            </Button>
          )}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold">
              T
            </div>
            <span className="font-bold text-lg hidden sm:inline-block">TalentFlow</span>
          </Link>
          
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground ml-6">
            <Link href="/find-jobs" className="hover:text-foreground transition-colors">Find Jobs</Link>
            <Link href="/find-freelancers" className="hover:text-foreground transition-colors">Freelancers</Link>
            <Link href="/find-courses" className="hover:text-foreground transition-colors">Courses</Link>
            <Link href="/find-talent" className="hover:text-foreground transition-colors">Find Talent</Link>
          </nav>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          {!mounted ? (
            <div className="h-8 w-24 bg-muted/30 rounded-md animate-pulse" />
          ) : !user ? (
            <>
              <Link href="/sign-in" className="hidden sm:inline-block">
                <Button variant="ghost" size="sm">Sign In</Button>
              </Link>
              <Link href="/sign-up">
                <Button size="sm">Get Started</Button>
              </Link>
            </>
          ) : (
            <>
              {/* Notification Bell Dropdown */}
              <DropdownMenu open={bellOpen} onOpenChange={setBellOpen}>
                <DropdownMenuTrigger 
                  id="notification-bell"
                  aria-label="Notifications"
                  className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "relative")}
                >
                  <Bell className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-red-600 text-white text-[10px] font-bold flex items-center justify-center border-2 border-background animate-in fade-in zoom-in">
                      {unreadCount > 99 ? "99+" : unreadCount}
                    </span>
                  )}
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80 sm:w-96">
                  <div className="flex items-center justify-between px-4 py-3 border-b">
                    <div className="flex items-center gap-2">
                      <DropdownMenuLabel className="p-0 font-semibold text-sm">Notifications</DropdownMenuLabel>
                      {unreadCount > 0 && (
                        <span className="rounded-full bg-primary/10 text-primary text-[10px] font-bold px-2 py-0.5">
                          {unreadCount} new
                        </span>
                      )}
                    </div>
                    {unreadCount > 0 && (
                      <button onClick={markAllAsRead} className="text-xs text-primary font-medium hover:underline">
                        Mark all as read
                      </button>
                    )}
                  </div>

                  <DropdownMenuGroup className="max-h-[320px] overflow-y-auto divide-y divide-border/40">
                    {notifications.length === 0 ? (
                      <div className="p-6 text-center text-sm text-muted-foreground">
                        <Bell className="h-8 w-8 text-muted-foreground/50 mx-auto mb-2" />
                        No notifications yet
                      </div>
                    ) : (
                      notifications.map((n) => (
                        <DropdownMenuItem
                          key={n.id}
                          className={cn(
                            "flex items-start gap-3 p-3 cursor-pointer transition-colors focus:bg-accent",
                            !n.isRead ? "bg-accent/40 font-medium" : "text-muted-foreground"
                          )}
                          onClick={() => handleNotificationClick(n)}
                        >
                          <div className="mt-0.5">{getNotificationIcon(n)}</div>
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-center gap-1 mb-0.5">
                              <span className={cn("text-xs font-semibold truncate", !n.isRead ? "text-foreground" : "text-muted-foreground")}>
                                {n.title}
                              </span>
                              {!n.isRead && <span className="h-2 w-2 rounded-full bg-blue-600 shrink-0" />}
                            </div>
                            <p className="text-xs text-muted-foreground line-clamp-2 leading-snug">{n.message}</p>
                          </div>
                        </DropdownMenuItem>
                      ))
                    )}
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <div className="p-2 text-center bg-muted/20">
                    <Link
                      href={`${getRoleBasePath(user?.role)}/notifications`}
                      onClick={() => setBellOpen(false)}
                      className="text-xs text-primary font-semibold hover:underline block py-1"
                    >
                      View all notifications
                    </Link>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* User Avatar Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger className={cn("relative h-8 w-8 rounded-full focus:outline-none flex items-center justify-center")}>
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.avatar} alt={user.name || user.email} />
                    <AvatarFallback>{(user.name || user.email || 'U').charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end">
                  <DropdownMenuGroup>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{user.name || user.email}</p>
                        <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                      </div>
                    </DropdownMenuLabel>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Link href={dashboardHref} className="w-full">
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link href={settingsHref} className="w-full">Settings</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout} className="cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          )}

          {/* Mobile Menu (Only if no sidebar) */}
          {!showSidebarToggle && (
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "md:hidden focus:outline-none")}>
                <Menu className="h-5 w-5" />
              </SheetTrigger>
              <SheetContent side="right">
                <div className="flex flex-col gap-4 mt-8">
                  <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-medium flex items-center gap-2">🏠 Home</Link>
                  <Link href="/find-jobs" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-medium flex items-center gap-2">💼 Job Seeker</Link>
                  <Link href="/find-talent" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-medium flex items-center gap-2">🏢 Employer</Link>
                  <Link href="/find-freelancers" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-medium flex items-center gap-2">⚡ Freelance</Link>
                  <Link href="/find-courses" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-medium flex items-center gap-2">🎓 Training</Link>
                  {!user && <Link href="/sign-up" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-medium flex items-center gap-2">📝 Register</Link>}
                </div>
              </SheetContent>
            </Sheet>
          )}
        </div>
      </div>
    </header>
  );
}

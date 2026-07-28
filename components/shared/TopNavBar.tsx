"use client";

import React from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";
import { useEffect, useState } from "react";
import { notificationService } from "@/lib/services/notification.service";
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
import { Bell, MessageSquare, Menu, LogOut, Briefcase } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

interface TopNavBarProps {
  onMenuClick?: () => void;
  showSidebarToggle?: boolean;
}

export function TopNavBar({ onMenuClick, showSidebarToggle = false }: TopNavBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [bellOpen, setBellOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setBellOpen(false);
  }, [pathname]);

  useEffect(() => {
    const fetchNotifications = async () => {
      if (user?.id) {
        try {
          const data = await notificationService.getNotifications({ userId: user.id });
          setNotifications(Array.isArray(data) ? data : []);
        } catch (error) {
          console.error("Failed to load notifications", error);
          setNotifications([]);
        }
      }
    };
    fetchNotifications();
  }, [user]);

  const safeNotifications = Array.isArray(notifications) ? notifications.filter(Boolean) : [];
  const unreadCount = safeNotifications.filter(n => !n.isRead).length;

  const markAsRead = async (id: string) => {
    if (!id) return;
    try {
      await notificationService.markAsRead(id);
      setNotifications(prev => (Array.isArray(prev) ? prev : []).map(n => n && n.id === id ? { ...n, isRead: true } : n));
    } catch (e) {
      console.error("Failed to mark as read", e);
    }
  };

  const markAllAsRead = async () => {
    try {
      const unreadList = safeNotifications.filter(n => n && n.id && !n.isRead);
      await Promise.all(unreadList.map(n => notificationService.markAsRead(n.id)));
      setNotifications(prev => (Array.isArray(prev) ? prev : []).map(n => n ? { ...n, isRead: true } : n));
    } catch (e) {
      console.error("Failed to mark all as read", e);
    }
  };

  const handleNotificationClick = async (n: any) => {
    if (!n.isRead) {
      await markAsRead(n.id);
    }
    if (n.link || n.url) {
      router.push(n.link || n.url);
    } else {
      const basePath = getRoleBasePath(user?.role);
      router.push(`${basePath}/notifications`);
    }
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
              <DropdownMenu>
                <DropdownMenuTrigger 
                  id="notification-bell"
                  aria-label="Notifications"
                  className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "relative")}
                >
                  <Bell className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-red-600 text-white text-[10px] font-bold flex items-center justify-center border-2 border-background">
                      {unreadCount > 99 ? "99+" : unreadCount}
                    </span>
                  )}
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80">
                  <div className="flex items-center justify-between px-3 py-2 border-b">
                    <DropdownMenuLabel className="p-0 font-semibold">Notifications</DropdownMenuLabel>
                    {unreadCount > 0 && (
                      <button onClick={markAllAsRead} className="text-xs text-primary font-medium hover:underline">
                        Mark all as read
                      </button>
                    )}
                  </div>
                  <DropdownMenuGroup className="max-h-[300px] overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-4 text-center text-sm text-muted-foreground">No notifications</div>
                    ) : (
                      notifications.map(n => (
                        <DropdownMenuItem key={n.id} className="flex flex-col items-start gap-1 p-3 cursor-pointer" onClick={() => handleNotificationClick(n)}>
                          <div className="flex w-full justify-between items-center">
                            <span className={cn("font-medium text-sm", !n.isRead ? "text-foreground font-semibold" : "text-muted-foreground")}>{n.title}</span>
                            {!n.isRead && <span className="h-2 w-2 rounded-full bg-blue-500 shrink-0" />}
                          </div>
                          <span className="text-xs text-muted-foreground line-clamp-2">{n.message}</span>
                        </DropdownMenuItem>
                      ))
                    )}
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <div className="p-2 text-center">
                    <Link href={`${getRoleBasePath(user?.role)}/notifications`} className="text-xs text-primary font-medium hover:underline block">
                      View all notifications
                    </Link>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
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

"use client";

import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";
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
  const { user, logout } = useAuth();

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
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-4">
          {showSidebarToggle && (
            <Button variant="ghost" size="icon" onClick={onMenuClick} className="md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle Sidebar</span>
            </Button>
          )}
          <Link href="/" className="flex items-center space-x-2">
            <div className="bg-primary text-primary-foreground p-1 rounded-md">
              <Briefcase className="h-6 w-6" />
            </div>
            <span className="font-bold text-xl hidden sm:inline-block">TalentFlow</span>
          </Link>
        </div>

        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link href="/talent" className="transition-colors hover:text-foreground/80 text-foreground/60">Find Talent</Link>
          <Link href="/courses" className="transition-colors hover:text-foreground/80 text-foreground/60">Academy</Link>
          <Link href="/employer/post-job" className="transition-colors hover:text-foreground/80 text-foreground/60">Post a Job</Link>
        </nav>

        <div className="flex items-center gap-4">
          {!user ? (
            <>
              <Link href="/sign-in" className="hidden sm:inline-block">
                <Button variant="ghost">Sign In</Button>
              </Link>
              <Link href="/sign-in">
                <Button>Get Started</Button>
              </Link>
            </>
          ) : (
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
          )}

          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "md:hidden focus:outline-none")}>
              <Menu className="h-5 w-5" />
            </SheetTrigger>
            <SheetContent side="right">
              <div className="flex flex-col gap-4 mt-8">
                <Link href="/talent" className="text-lg font-medium">Find Talent</Link>
                <Link href="/courses" className="text-lg font-medium">Academy</Link>
                <Link href="/employer/post-job" className="text-lg font-medium">Post a Job</Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

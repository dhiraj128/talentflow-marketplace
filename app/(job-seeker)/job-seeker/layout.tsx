"use client";

import React, { useState } from "react";
import { TopNavBar } from "@/components/shared/TopNavBar";
import { SideNavBar, SidebarRoute } from "@/components/shared/SideNavBar";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  FileText, 
  Bookmark, 
  Sparkles,
  FileSignature,
  Award,
  ClipboardList,
  MessageSquare,
  Bell,
  User,
  ShieldCheck,
  Settings,
  LogOut
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";

const jobSeekerRoutes: SidebarRoute[] = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/job-seeker/dashboard" },
  { label: "Applications", icon: FileText, href: "/job-seeker/applications" },
  { label: "Saved Jobs", icon: Bookmark, href: "/job-seeker/saved-jobs" },
  { label: "Recommended Jobs", icon: Sparkles, href: "/job-seeker/recommended" },
  { label: "Resume Center ⭐", icon: FileSignature, href: "/job-seeker/resume-center" },
  { label: "Certificates", icon: Award, href: "/job-seeker/certificates" },
  { label: "Assessments", icon: ClipboardList, href: "/job-seeker/assessments" },
  { label: "Messages", icon: MessageSquare, href: "/job-seeker/messages" },
  { label: "Notifications", icon: Bell, href: "/job-seeker/notifications" },
  { label: "Profile", icon: User, href: "/job-seeker/profile" },
  { label: "Verification", icon: ShieldCheck, href: "/job-seeker/verification" },
  { label: "Settings", icon: Settings, href: "/job-seeker/settings" },
];

export default function JobSeekerLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-col">
      <TopNavBar 
        showSidebarToggle 
        onMenuClick={() => setSidebarOpen(!isSidebarOpen)} 
      />
      <div className="flex flex-1 overflow-hidden relative">
        <div 
          className={cn(
            "absolute inset-y-0 left-0 z-50 transform transition-transform duration-200 ease-in-out md:relative md:translate-x-0 bg-background",
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <SideNavBar routes={jobSeekerRoutes} title="Job Seeker Portal" isOpen={true} />
        </div>
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden" 
            onClick={() => setSidebarOpen(false)} 
          />
        )}
        <main className="flex-1 overflow-y-auto bg-muted/20 w-full">
          <div className="container py-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

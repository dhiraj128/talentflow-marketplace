"use client";

import React, { useState } from "react";
import { TopNavBar } from "@/components/shared/TopNavBar";
import { SideNavBar, SidebarRoute } from "@/components/shared/SideNavBar";
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
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex min-h-screen flex-col">
      <TopNavBar 
        showSidebarToggle 
        onMenuClick={() => setSidebarOpen(!isSidebarOpen)} 
      />
      <div className="flex flex-1 overflow-hidden">
        <div className="hidden md:block">
          <SideNavBar routes={jobSeekerRoutes} title="Job Seeker Portal" isOpen={isSidebarOpen} />
        </div>
        <main className="flex-1 overflow-y-auto bg-muted/20">
          <div className="container py-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

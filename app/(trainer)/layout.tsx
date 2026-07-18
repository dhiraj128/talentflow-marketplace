"use client";

import React, { useState } from "react";
import { TopNavBar } from "@/components/shared/TopNavBar";
import { SideNavBar, SidebarRoute } from "@/components/shared/SideNavBar";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  BookOpen, 
  Users, 
  FileText,
  Award,
  Video,
  Calendar,
  Download,
  Bell,
  BarChart,
  DollarSign,
  MessageSquare,
  Settings 
} from "lucide-react";

const trainerRoutes: SidebarRoute[] = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/trainer/dashboard" },
  { label: "Courses", icon: BookOpen, href: "/trainer/courses" },
  { label: "Students", icon: Users, href: "/trainer/students" },
  { label: "Live Classes", icon: Video, href: "/trainer/live" },
  { label: "Upcoming Sessions", icon: Calendar, href: "/trainer/sessions" },
  { label: "Assignments", icon: FileText, href: "/trainer/assignments" },
  { label: "Certificates", icon: Award, href: "/trainer/certificates" },
  { label: "Downloads", icon: Download, href: "/trainer/downloads" },
  { label: "Announcements", icon: Bell, href: "/trainer/announcements" },
  { label: "Analytics", icon: BarChart, href: "/trainer/analytics" },
  { label: "Revenue", icon: DollarSign, href: "/trainer/revenue" },
  { label: "Messages", icon: MessageSquare, href: "/trainer/messages" },
  { label: "Settings", icon: Settings, href: "/trainer/settings" },
];

export default function TrainerLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-col bg-background">
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
          <SideNavBar routes={trainerRoutes} title="Trainer Portal" isOpen={true} />
        </div>
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden" 
            onClick={() => setSidebarOpen(false)} 
          />
        )}
        <main className="flex-1 overflow-y-auto bg-muted/20 w-full">
          <div className="mx-auto max-w-7xl px-4 md:px-10 py-8 space-y-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

"use client";

import React, { useState } from "react";
import { TopNavBar } from "@/components/shared/TopNavBar";
import { SideNavBar, SidebarRoute } from "@/components/shared/SideNavBar";
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
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <TopNavBar 
        showSidebarToggle 
        onMenuClick={() => setSidebarOpen(!isSidebarOpen)} 
      />
      <div className="flex flex-1 overflow-hidden">
        <div className="hidden md:block">
          <SideNavBar routes={trainerRoutes} title="Trainer Portal" isOpen={isSidebarOpen} />
        </div>
        <main className="flex-1 overflow-y-auto bg-muted/20">
          <div className="mx-auto max-w-7xl px-10 py-8 space-y-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

"use client";

import React, { useState } from "react";
import { TopNavBar } from "@/components/shared/TopNavBar";
import { SideNavBar, SidebarRoute } from "@/components/shared/SideNavBar";
import { 
  LayoutDashboard, 
  Users, 
  Building2, 
  FileCheck2, 
  GraduationCap,
  Network,
  BarChart3,
  ShieldCheck,
  Settings
} from "lucide-react";

const adminRoutes: SidebarRoute[] = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/admin/dashboard" },
  { label: "Users", icon: Users, href: "/admin/users" },
  { label: "Employers", icon: Building2, href: "/admin/employers" },
  { label: "Candidate Review", icon: FileCheck2, href: "/admin/reviews/job-seekers" },
  { label: "Job Approvals", icon: FileCheck2, href: "/admin/reviews/jobs" },
  { label: "Course Approvals", icon: GraduationCap, href: "/admin/reviews/courses" },
  { label: "Matching Engine", icon: Network, href: "/admin/matching" },
  { label: "Analytics", icon: BarChart3, href: "/admin/analytics" },
  { label: "Audit Logs", icon: ShieldCheck, href: "/admin/audit" },
  { label: "Settings", icon: Settings, href: "/admin/settings" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex min-h-screen flex-col">
      <TopNavBar 
        showSidebarToggle 
        onMenuClick={() => setSidebarOpen(!isSidebarOpen)} 
      />
      <div className="flex flex-1 overflow-hidden">
        <div className="hidden md:block">
          <SideNavBar routes={adminRoutes} title="Admin Console" isOpen={isSidebarOpen} />
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

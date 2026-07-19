"use client";

import React, { useState } from "react";
import { TopNavBar } from "@/components/shared/TopNavBar";
import { SideNavBar, SidebarRoute } from "@/components/shared/SideNavBar";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
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
  { label: "Candidates", icon: Users, href: "/admin/candidates" },
  { label: "Candidate Review", icon: FileCheck2, href: "/admin/reviews/job-seekers" },
  { label: "Job Approvals", icon: FileCheck2, href: "/admin/reviews/jobs" },
  { label: "Course Approvals", icon: GraduationCap, href: "/admin/course-reviews" },
  { label: "Pending Approvals", icon: FileCheck2, href: "/admin/pending-approvals" },
  { label: "Matching Engine", icon: Network, href: "/admin/matching" },
  { label: "Analytics", icon: BarChart3, href: "/admin/analytics" },
  { label: "Audit Logs", icon: ShieldCheck, href: "/admin/audit-logs" },
  { label: "Settings", icon: Settings, href: "/admin/settings" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  React.useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  React.useEffect(() => {
    if (isSidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isSidebarOpen]);

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
          <SideNavBar routes={adminRoutes} title="Admin Console" isOpen={true} />
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

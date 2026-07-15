"use client";

import React, { useState } from "react";
import { TopNavBar } from "@/components/shared/TopNavBar";
import { SideNavBar, SidebarRoute } from "@/components/shared/SideNavBar";
import { 
  LayoutDashboard, 
  Briefcase, 
  FileText, 
  CreditCard, 
  Settings 
} from "lucide-react";

const employerRoutes: SidebarRoute[] = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/employer/dashboard" },
  { label: "Post a Job", icon: Briefcase, href: "/employer/post-job" },
  { label: "Applications", icon: FileText, href: "/employer/applications" },
  { label: "Billing", icon: CreditCard, href: "/employer/billing" },
  { label: "Subscription", icon: CreditCard, href: "/employer/subscription" },
  { label: "Settings", icon: Settings, href: "/employer/settings" },
];

export default function EmployerLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex min-h-screen flex-col">
      <TopNavBar 
        showSidebarToggle 
        onMenuClick={() => setSidebarOpen(!isSidebarOpen)} 
      />
      <div className="flex flex-1 overflow-hidden">
        <div className="hidden md:block">
          <SideNavBar routes={employerRoutes} title="Employer Portal" isOpen={isSidebarOpen} />
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

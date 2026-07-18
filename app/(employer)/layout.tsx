"use client";

import React, { useState } from "react";
import { TopNavBar } from "@/components/shared/TopNavBar";
import { SideNavBar, SidebarRoute } from "@/components/shared/SideNavBar";
import { cn } from "@/lib/utils";
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
          <SideNavBar routes={employerRoutes} title="Employer Portal" isOpen={true} />
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

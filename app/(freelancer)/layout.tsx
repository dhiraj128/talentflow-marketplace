"use client";

import React, { useState } from "react";
import { TopNavBar } from "@/components/shared/TopNavBar";
import { SideNavBar, SidebarRoute } from "@/components/shared/SideNavBar";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  Briefcase, 
  FileText, 
  FolderOpen,
  Image,
  Layers,
  Star,
  MessageSquare,
  DollarSign,
  CreditCard,
  Settings 
} from "lucide-react";

const freelancerRoutes: SidebarRoute[] = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/freelancer/dashboard" },
  { label: "Browse Projects", icon: Briefcase, href: "/search?type=jobs" },
  { label: "My Proposals", icon: FileText, href: "/freelancer/proposals" },
  { label: "My Projects", icon: FolderOpen, href: "/freelancer/projects" },
  { label: "Portfolio", icon: Image, href: "/freelancer/portfolio" },
  { label: "Services", icon: Layers, href: "/freelancer/services" },
  { label: "Reviews", icon: Star, href: "/freelancer/reviews" },
  { label: "Messages", icon: MessageSquare, href: "/freelancer/messages" },
  { label: "Earnings", icon: DollarSign, href: "/freelancer/earnings" },
  { label: "Payments", icon: CreditCard, href: "/freelancer/payments" },
  { label: "Settings", icon: Settings, href: "/freelancer/settings" },
];

export default function FreelancerLayout({ children }: { children: React.ReactNode }) {
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
          <SideNavBar routes={freelancerRoutes} title="Freelancer Portal" isOpen={true} />
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

"use client";

import React, { useState } from "react";
import { TopNavBar } from "@/components/shared/TopNavBar";
import { SideNavBar, SidebarRoute } from "@/components/shared/SideNavBar";
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
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex min-h-screen flex-col">
      <TopNavBar 
        showSidebarToggle 
        onMenuClick={() => setSidebarOpen(!isSidebarOpen)} 
      />
      <div className="flex flex-1 overflow-hidden">
        <div className="hidden md:block">
          <SideNavBar routes={freelancerRoutes} title="Freelancer Portal" isOpen={isSidebarOpen} />
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

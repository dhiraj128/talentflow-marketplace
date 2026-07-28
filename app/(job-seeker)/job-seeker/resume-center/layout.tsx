"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { PageContainer } from "@/components/shared/PageContainer";
import { PageHeader } from "@/components/shared/PageHeader";

const navItems = [
  { href: "/job-seeker/resume-center", label: "Overview" },
  { href: "/job-seeker/resume-center/builder", label: "Builder" },
  { href: "/job-seeker/resume-center/my-resume", label: "My Resume" },
  { href: "/job-seeker/resume-center/ats", label: "ATS Check" },
  { href: "/job-seeker/resume-center/templates", label: "Templates" },
  { href: "/job-seeker/resume-center/services", label: "Services" },
  { href: "/job-seeker/resume-center/orders", label: "Orders" },
  { href: "/job-seeker/resume-center/cover-letter", label: "Cover Letter" },
  { href: "/job-seeker/resume-center/verification", label: "Verification" },
  { href: "/job-seeker/resume-center/portfolio", label: "Portfolio" },
  { href: "/job-seeker/resume-center/downloads", label: "Downloads" },
  { href: "/job-seeker/resume-center/analytics", label: "Analytics" },
];

export default function ResumeCenterLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const activeTabRef = useRef<HTMLAnchorElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (activeTabRef.current) {
      activeTabRef.current.scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest"
      });
    }
  }, [pathname]);

  return (
    <PageContainer className="w-full max-w-full min-w-0 overflow-x-hidden">
      <PageHeader 
        title="Resume Center ⭐" 
        description="Build, manage, and optimize your resume to land your dream job."
      />
      
      {/* Scrollable Responsive Tabs Bar */}
      <div 
        ref={containerRef}
        className="w-full max-w-full min-w-0 overflow-x-auto whitespace-nowrap border-b border-border pb-1 mb-6 flex items-center gap-1 sm:gap-2 px-1 scrollbar-none"
      >
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              ref={isActive ? activeTabRef : undefined}
              className={cn(
                "shrink-0 whitespace-nowrap px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium transition-colors border-b-2 rounded-t-md focus:outline-none",
                isActive 
                  ? "border-primary text-primary font-semibold bg-primary/5" 
                  : "border-transparent text-muted-foreground hover:border-muted hover:text-foreground"
              )}
            >
              {item.label}
            </Link>
          );
        })}
      </div>
      
      <div className="w-full max-w-full min-w-0 overflow-x-hidden">{children}</div>
    </PageContainer>
  );
}

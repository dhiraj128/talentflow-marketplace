"use client";

import React from "react";
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

  return (
    <PageContainer>
      <PageHeader 
        title="Resume Center ⭐" 
        description="Build, manage, and optimize your resume to land your dream job."
      />
      <div className="flex space-x-1 overflow-x-auto border-b border-border pb-px mb-6 scrollbar-hide">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "whitespace-nowrap px-4 py-2 text-sm font-medium transition-colors border-b-2 hover:text-primary",
                isActive 
                  ? "border-primary text-primary" 
                  : "border-transparent text-muted-foreground hover:border-muted"
              )}
            >
              {item.label}
            </Link>
          );
        })}
      </div>
      <div>{children}</div>
    </PageContainer>
  );
}

"use client";

import React from "react";
import { TopNavBar } from "@/components/shared/TopNavBar";
import { Footer } from "@/components/shared/Footer";
import { usePathname } from "next/navigation";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = pathname === "/sign-in" || 
                     pathname === "/sign-up" || 
                     pathname === "/forgot-password" || 
                     pathname === "/reset-password" ||
                     pathname.startsWith("/auth");

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <TopNavBar />
      <main className="flex-1 w-full max-w-full min-w-0">
        {children}
      </main>
      <Footer variant={isAuthPage ? "dark" : "default"} />
    </div>
  );
}

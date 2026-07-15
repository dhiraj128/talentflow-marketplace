import React from "react";
import { TopNavBar } from "@/components/shared/TopNavBar";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <TopNavBar />
      <main className="flex-1">
        {children}
      </main>
      <footer className="border-t py-6 md:py-0">
        <div className="mx-auto w-full max-w-7xl px-6 lg:px-8 flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row text-sm text-muted-foreground">
          <p>© 2026 TalentFlow Marketplace. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <a href="#" className="hover:underline">Terms of Service</a>
            <a href="#" className="hover:underline">Privacy Policy</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

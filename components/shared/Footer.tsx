"use client";

import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface FooterProps {
  variant?: "default" | "dark";
  className?: string;
}

export function Footer({ variant = "default", className }: FooterProps) {
  const isDark = variant === "dark";

  return (
    <footer 
      className={cn(
        "w-full py-12 md:py-16 transition-colors",
        isDark 
          ? "bg-[#081526] text-white border-t border-[#22344F]" 
          : "bg-card border-t border-border text-foreground",
        className
      )}
    >
      <div className="mx-auto w-full max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-12">
          <div className="col-span-2 lg:col-span-2">
            <span className={cn("font-bold text-2xl tracking-tight", isDark ? "text-white" : "text-foreground")}>
              TalentFlow
            </span>
            <p className={cn("mt-4 text-sm max-w-sm leading-relaxed", isDark ? "text-slate-400" : "text-muted-foreground")}>
              Your Career Ecosystem — All in One Place. Connect with verified employers, freelance projects, and certified training programs.
            </p>
            <p className={cn("mt-6 text-sm font-semibold", isDark ? "text-slate-400" : "text-muted-foreground")}>
              Powered by TalentFlow Platform
            </p>
          </div>
          
          <div>
            <h3 className={cn("font-bold mb-4", isDark ? "text-white" : "text-foreground")}>Platform</h3>
            <ul className={cn("space-y-3 text-sm", isDark ? "text-slate-400" : "text-muted-foreground")}>
              <li><Link href="/find-jobs" className={cn("transition-colors", isDark ? "hover:text-blue-400" : "hover:text-primary")}>Find Jobs</Link></li>
              <li><Link href="/find-freelancers" className={cn("transition-colors", isDark ? "hover:text-blue-400" : "hover:text-primary")}>Freelancers</Link></li>
              <li><Link href="/find-courses" className={cn("transition-colors", isDark ? "hover:text-blue-400" : "hover:text-primary")}>Training</Link></li>
              <li><Link href="/find-talent" className={cn("transition-colors", isDark ? "hover:text-blue-400" : "hover:text-primary")}>Employers</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className={cn("font-bold mb-4", isDark ? "text-white" : "text-foreground")}>Company</h3>
            <ul className={cn("space-y-3 text-sm", isDark ? "text-slate-400" : "text-muted-foreground")}>
              <li><Link href="/about" className={cn("transition-colors", isDark ? "hover:text-blue-400" : "hover:text-primary")}>About Us</Link></li>
              <li><Link href="/blog" className={cn("transition-colors", isDark ? "hover:text-blue-400" : "hover:text-primary")}>Blog</Link></li>
              <li><Link href="/careers" className={cn("transition-colors", isDark ? "hover:text-blue-400" : "hover:text-primary")}>Career Resources</Link></li>
              <li><Link href="/contact" className={cn("transition-colors", isDark ? "hover:text-blue-400" : "hover:text-primary")}>Contact</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className={cn("font-bold mb-4", isDark ? "text-white" : "text-foreground")}>Legal</h3>
            <ul className={cn("space-y-3 text-sm", isDark ? "text-slate-400" : "text-muted-foreground")}>
              <li><Link href="/privacy" className={cn("transition-colors", isDark ? "hover:text-blue-400" : "hover:text-primary")}>Privacy Policy</Link></li>
              <li><Link href="/terms" className={cn("transition-colors", isDark ? "hover:text-blue-400" : "hover:text-primary")}>Terms & Conditions</Link></li>
              <li><Link href="/cookie" className={cn("transition-colors", isDark ? "hover:text-blue-400" : "hover:text-primary")}>Cookie Policy</Link></li>
            </ul>
          </div>
        </div>
        
        <div className={cn("border-t pt-8 flex flex-col md:flex-row justify-between items-center gap-4", isDark ? "border-[#22344F]" : "border-border")}>
          <p className={cn("text-sm", isDark ? "text-slate-400" : "text-muted-foreground")}>
            TalentFlow Marketplace © 2026. All rights reserved.
          </p>
          <div className="flex gap-4">
            <a 
              href="#" 
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center transition-all",
                isDark 
                  ? "bg-[#0F1E33] border border-[#22344F] text-slate-300 hover:bg-[#2563EB] hover:text-white" 
                  : "bg-muted text-muted-foreground hover:bg-primary hover:text-primary-foreground"
              )}
            >
              <span className="sr-only">Twitter</span>
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" /></svg>
            </a>
            <a 
              href="#" 
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center transition-all",
                isDark 
                  ? "bg-[#0F1E33] border border-[#22344F] text-slate-300 hover:bg-[#2563EB] hover:text-white" 
                  : "bg-muted text-muted-foreground hover:bg-primary hover:text-primary-foreground"
              )}
            >
              <span className="sr-only">LinkedIn</span>
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" /></svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

"use client";

import React from "react";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { UploadCloud, FileText, Scan, Search, Bookmark, Clock, CheckCircle2 } from "lucide-react";

interface WelcomeHeaderProps {
  user: any;
  resumeStatus?: "Complete" | "Missing" | "Needs Update";
  lastLogin?: string;
}

export function WelcomeHeader({ user, resumeStatus = "Complete", lastLogin }: WelcomeHeaderProps) {
  const firstName = user?.name?.split(" ")[0] || user?.email?.split("@")[0] || "Guest";
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white/50 dark:bg-zinc-900/50 backdrop-blur-xl border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-sm relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 p-32 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
      <div className="absolute bottom-0 left-0 p-32 bg-blue-500/5 rounded-full blur-3xl -ml-16 -mb-16 pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
        
        <div className="flex items-center gap-5">
          <Avatar className="h-16 w-16 sm:h-20 sm:w-20 border-2 border-primary/20 shadow-sm">
            <AvatarImage src={user?.avatarUrl} alt={user?.name || "User"} />
            <AvatarFallback className="text-xl sm:text-2xl bg-primary/10 text-primary">
              {firstName.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          
          <div className="space-y-1.5">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
              Welcome back, {firstName}! 👋
            </h1>
            <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              <span className="font-medium text-zinc-700 dark:text-zinc-300">{user?.roleTitle || "Software Engineer"}</span>
              <span className="hidden sm:inline">•</span>
              <div className="flex items-center gap-1.5">
                {resumeStatus === "Complete" ? (
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                ) : (
                  <div className="w-2 h-2 rounded-full bg-amber-500" />
                )}
                <span>Resume: {resumeStatus}</span>
              </div>
              <span className="hidden sm:inline">•</span>
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                <span>Last login: {lastLogin || "Just now"}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full lg:w-auto grid grid-cols-2 sm:flex sm:flex-row gap-3">
          <Link href="/job-seeker/resume-center" className="w-full sm:w-auto">
            <Button variant="outline" className="w-full sm:w-auto justify-start sm:justify-center bg-white/80 dark:bg-zinc-900/80 hover:bg-zinc-100 dark:hover:bg-zinc-800">
              <UploadCloud className="w-4 h-4 mr-2 text-blue-500" />
              Upload Resume
            </Button>
          </Link>
          <Link href="/job-seeker/resume-center/builder" className="w-full sm:w-auto">
            <Button variant="outline" className="w-full sm:w-auto justify-start sm:justify-center bg-white/80 dark:bg-zinc-900/80 hover:bg-zinc-100 dark:hover:bg-zinc-800">
              <FileText className="w-4 h-4 mr-2 text-purple-500" />
              Builder
            </Button>
          </Link>
          <Link href="/find-jobs" className="col-span-2 sm:col-span-1 w-full sm:w-auto">
            <Button className="w-full sm:w-auto shadow-md">
              <Search className="w-4 h-4 mr-2" />
              Browse Jobs
            </Button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

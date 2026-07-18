"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bookmark, Building2, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface SavedJob {
  id: string;
  title: string;
  companyName: string;
  companyLogo?: string;
  location: string;
  savedAt: string;
}

interface SavedJobsWidgetProps {
  jobs: SavedJob[];
}

export function SavedJobsWidget({ jobs }: SavedJobsWidgetProps) {
  return (
    <Card className="h-full bg-white/50 dark:bg-zinc-900/50 backdrop-blur-xl border-zinc-200/50 dark:border-zinc-800/50">
      <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-zinc-100 dark:border-zinc-800">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Bookmark className="w-5 h-5 text-pink-500" />
          Saved Jobs
        </CardTitle>
        <Link href="/job-seeker/saved-jobs">
          <Button variant="link" className="text-sm h-auto p-0">View All</Button>
        </Link>
      </CardHeader>
      <CardContent className="pt-4 p-0">
        {jobs.length === 0 ? (
          <div className="p-6 text-center text-muted-foreground">
            <p className="text-sm">No saved jobs found.</p>
          </div>
        ) : (
          <div className="flex flex-col divide-y divide-zinc-100 dark:divide-zinc-800">
            {jobs.map((job) => (
              <div key={job.id} className="p-4 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors flex items-center gap-4">
                <Avatar className="h-10 w-10 border shadow-sm shrink-0">
                  <AvatarImage src={job.companyLogo} />
                  <AvatarFallback className="text-xs bg-zinc-100 dark:bg-zinc-800">
                    {job.companyName.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-grow min-w-0">
                  <Link href={`/find-jobs/${job.id}`} className="hover:underline font-medium text-sm text-zinc-900 dark:text-zinc-100 line-clamp-1">
                    {job.title}
                  </Link>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                    <div className="flex items-center gap-1">
                      <Building2 className="w-3 h-3" />
                      <span className="truncate max-w-[80px] sm:max-w-[120px]">{job.companyName}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      <span className="truncate max-w-[80px] sm:max-w-[120px]">{job.location}</span>
                    </div>
                  </div>
                </div>
                
                <Link href={`/find-jobs/${job.id}`} className="shrink-0">
                  <Button variant="outline" size="sm" className="h-8">Apply</Button>
                </Link>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

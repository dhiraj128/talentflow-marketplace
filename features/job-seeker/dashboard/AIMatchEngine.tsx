"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Briefcase, Zap, BookmarkPlus, ExternalLink } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface AIMatchJob {
  id: string;
  matchScore: number;
  title: string;
  companyName: string;
  companyLogo?: string;
  location: string;
  salary: string;
  experience: string;
  skills: string[];
  missingSkills: string[];
  postedDate: string;
}

interface AIMatchEngineProps {
  jobs: AIMatchJob[];
}

export function AIMatchEngine({ jobs }: AIMatchEngineProps) {
  if (!jobs || jobs.length === 0) {
    return (
      <Card className="border-dashed bg-transparent border-zinc-200 dark:border-zinc-800">
        <CardContent className="flex flex-col items-center justify-center p-10 text-center">
          <Zap className="w-10 h-10 text-zinc-300 dark:text-zinc-700 mb-4" />
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">No AI Matches yet</h3>
          <p className="text-muted-foreground text-sm max-w-sm mt-2">
            Complete your profile and upload a resume so our AI can find the best matches for you.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
      {jobs.map((job) => (
        <Card key={job.id} className="relative overflow-hidden group bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 hover:border-primary/50 transition-colors">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-primary/20 to-transparent rounded-bl-full -mr-4 -mt-4 opacity-50 group-hover:opacity-100 transition-opacity" />
          
          <CardContent className="p-5 sm:p-6 flex flex-col h-full relative z-10">
            <div className="flex justify-between items-start gap-4 mb-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12 border shadow-sm">
                  <AvatarImage src={job.companyLogo} />
                  <AvatarFallback className="bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
                    {job.companyName.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold text-base sm:text-lg text-zinc-900 dark:text-zinc-100 line-clamp-1">{job.title}</h3>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 line-clamp-1">{job.companyName}</p>
                </div>
              </div>
              <div className="flex flex-col items-end shrink-0">
                <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20 border-primary/20 font-bold px-2 py-0.5">
                  {job.matchScore}% Match
                </Badge>
                <span className="text-xs text-muted-foreground mt-1">{job.postedDate}</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-y-2 gap-x-4 mb-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1.5 shrink-0">
                <MapPin className="w-4 h-4 shrink-0" />
                <span className="truncate">{job.location}</span>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <Briefcase className="w-4 h-4 shrink-0" />
                <span>{job.experience}</span>
              </div>
              <div className="flex items-center gap-1.5 shrink-0 text-zinc-900 dark:text-zinc-100 font-medium">
                <span>{job.salary}</span>
              </div>
            </div>

            <div className="mb-6 flex-grow">
              <div className="mb-2">
                <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Required Skills</span>
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  {job.skills.map((skill) => (
                    <Badge key={skill} variant="outline" className="bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20 rounded-md font-normal">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
              {job.missingSkills.length > 0 && (
                <div className="mt-3">
                  <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Missing Skills</span>
                  <div className="flex flex-wrap gap-1.5 mt-1.5">
                    {job.missingSkills.map((skill) => (
                      <Badge key={skill} variant="outline" className="bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-500/20 rounded-md font-normal">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 sm:flex sm:flex-row gap-2 mt-auto pt-4 border-t border-zinc-100 dark:border-zinc-800">
              <Link href={`/find-jobs/${job.id}`} className="col-span-2 sm:col-span-1 sm:flex-1">
                <Button className="w-full">
                  Apply Now
                </Button>
              </Link>
              <Button variant="outline" className="w-full sm:w-auto px-3">
                <BookmarkPlus className="w-4 h-4 mr-2 sm:mr-0" />
                <span className="sm:hidden">Save</span>
              </Button>
              <Link href={`/find-jobs/${job.id}`} className="w-full sm:w-auto">
                <Button variant="ghost" className="w-full sm:w-auto px-3">
                  <ExternalLink className="w-4 h-4 mr-2 sm:mr-0" />
                  <span className="sm:hidden">Details</span>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

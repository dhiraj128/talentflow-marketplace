"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, FileText, ExternalLink } from "lucide-react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Application {
  id: string;
  companyName: string;
  roleTitle: string;
  appliedDate: string;
  status: "APPLIED" | "REVIEWING" | "SHORTLISTED" | "INTERVIEWING" | "OFFERED" | "REJECTED";
  lastUpdated: string;
  jobId: string;
}

interface ApplicationTrackerTableProps {
  applications: Application[];
}

export function ApplicationTrackerTable({ applications }: ApplicationTrackerTableProps) {
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "APPLIED":
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20">Applied</Badge>;
      case "REVIEWING":
        return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20">Under Review</Badge>;
      case "SHORTLISTED":
        return <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-500/10 dark:text-purple-400 dark:border-purple-500/20">Shortlisted</Badge>;
      case "INTERVIEWING":
        return <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20">Interview Scheduled</Badge>;
      case "OFFERED":
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 dark:bg-green-500/10 dark:text-green-400 dark:border-green-500/20">Offer</Badge>;
      case "REJECTED":
        return <Badge variant="outline" className="bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20">Rejected</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <Card className="bg-white/50 dark:bg-zinc-900/50 backdrop-blur-xl border-zinc-200/50 dark:border-zinc-800/50 overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <FileText className="w-5 h-5 text-blue-500" />
          Application Tracker
        </CardTitle>
        <Link href="/job-seeker/applications">
          <Button variant="link" className="text-sm h-auto p-0">View All</Button>
        </Link>
      </CardHeader>
      <CardContent className="p-0">
        {applications.length === 0 ? (
          <div className="p-8 text-center border-t border-zinc-100 dark:border-zinc-800">
            <p className="text-muted-foreground">You haven't applied to any jobs yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground bg-zinc-50/50 dark:bg-zinc-900/50 border-y border-zinc-100 dark:border-zinc-800">
                <tr>
                  <th className="px-4 sm:px-6 py-3 font-medium">Role & Company</th>
                  <th className="px-4 sm:px-6 py-3 font-medium">Status</th>
                  <th className="px-4 sm:px-6 py-3 font-medium hidden sm:table-cell">Applied Date</th>
                  <th className="px-4 sm:px-6 py-3 font-medium hidden md:table-cell">Last Updated</th>
                  <th className="px-4 sm:px-6 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {applications.map((app) => (
                  <tr key={app.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/20 transition-colors">
                    <td className="px-4 sm:px-6 py-4">
                      <div className="font-medium text-zinc-900 dark:text-zinc-100">{app.roleTitle}</div>
                      <div className="text-muted-foreground text-xs mt-0.5">{app.companyName}</div>
                      
                      {/* Mobile only dates */}
                      <div className="sm:hidden text-xs text-muted-foreground mt-2">
                        Applied: {app.appliedDate}
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-4">
                      {getStatusBadge(app.status)}
                    </td>
                    <td className="px-4 sm:px-6 py-4 hidden sm:table-cell whitespace-nowrap text-muted-foreground">
                      {app.appliedDate}
                    </td>
                    <td className="px-4 sm:px-6 py-4 hidden md:table-cell whitespace-nowrap text-muted-foreground">
                      {app.lastUpdated}
                    </td>
                    <td className="px-4 sm:px-6 py-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Link href={`/find-jobs/${app.jobId}`} className="flex items-center w-full">
                              <ExternalLink className="mr-2 h-4 w-4" />
                              View Job
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Link href={`/job-seeker/applications/${app.id}`} className="flex items-center w-full">
                              <FileText className="mr-2 h-4 w-4" />
                              Application Details
                            </Link>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

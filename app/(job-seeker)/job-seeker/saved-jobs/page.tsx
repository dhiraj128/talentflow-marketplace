"use client";

import React, { useEffect, useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { JobCard } from "@/components/shared/JobCard";
import { EmptyState } from "@/components/shared/EmptyState";
import { Bookmark, Search, Lock, ShieldAlert, RefreshCw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { jobService } from "@/lib/services/job.service";
import { useAuth } from "@/lib/auth-context";
import { toast } from "sonner";

export default function SavedJobsPage() {
  const { user } = useAuth();
  const [savedJobs, setSavedJobs] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [statusState, setStatusState] = useState<"IDLE" | "SUCCESS" | "UNAUTH" | "FORBIDDEN" | "ERROR">("IDLE");

  useEffect(() => {
    fetchSavedJobs();
  }, [user]);

  const fetchSavedJobs = async () => {
    setIsLoading(true);
    setStatusState("IDLE");
    try {
      const data = await jobService.getSavedJobs();
      const list = Array.isArray(data) ? data : data?.data || [];
      setSavedJobs(list);
      setStatusState("SUCCESS");
    } catch (err: any) {
      console.error("Failed to load saved jobs", err);
      const statusCode = err?.response?.status;
      if (statusCode === 401) {
        setStatusState("UNAUTH");
      } else if (statusCode === 403) {
        setStatusState("FORBIDDEN");
      } else {
        setStatusState("ERROR");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnsave = async (jobId: string) => {
    try {
      await jobService.unsaveJob(jobId);
      toast.success("Job removed from saved list");
      fetchSavedJobs();
    } catch (err) {
      toast.error("Failed to unsave job");
    }
  };

  const filteredJobs = savedJobs.filter((j) =>
    searchTerm
      ? j.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        j.company?.toLowerCase().includes(searchTerm.toLowerCase())
      : true
  );

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8">
      <PageHeader
        title="Saved Jobs"
        description="Jobs you have bookmarked for later"
      />

      <div className="flex items-center gap-4 bg-card p-4 rounded-xl border">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search saved jobs..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {isLoading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-48 rounded-xl border bg-muted/20 animate-pulse p-4" />
          ))}
        </div>
      ) : statusState === "UNAUTH" ? (
        <div className="p-12 text-center border rounded-xl bg-card space-y-4">
          <Lock className="w-12 h-12 text-muted-foreground mx-auto" />
          <h3 className="text-xl font-bold">Sign in to view your saved jobs</h3>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            Please sign in with your candidate account to manage your bookmarked positions.
          </p>
          <Button onClick={() => window.location.href = "/sign-in"} className="mt-2">
            Sign In
          </Button>
        </div>
      ) : statusState === "FORBIDDEN" ? (
        <div className="p-12 text-center border rounded-xl bg-card space-y-4">
          <ShieldAlert className="w-12 h-12 text-amber-500 mx-auto" />
          <h3 className="text-xl font-bold">Candidate Account Required</h3>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            Saving jobs is a Candidate feature. Please log in as a candidate to access saved jobs.
          </p>
        </div>
      ) : statusState === "ERROR" ? (
        <div className="p-8 text-center text-red-600 border border-red-200 rounded-xl bg-red-50/50 space-y-3">
          <p className="font-semibold">Unable to load saved jobs. Please try again.</p>
          <Button variant="outline" size="sm" onClick={fetchSavedJobs} className="gap-2">
            <RefreshCw className="w-4 h-4" /> Retry
          </Button>
        </div>
      ) : filteredJobs.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
          {filteredJobs.map((job) => (
            <div key={job.id} className="relative group">
              <JobCard job={job} />
              <button
                onClick={() => handleUnsave(job.id)}
                className="absolute top-3 right-3 text-xs text-red-500 bg-background/90 hover:bg-red-50 p-1.5 rounded-md border shadow-xs"
                title="Remove saved job"
              >
                Unsave
              </button>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<Bookmark className="h-10 w-10 text-muted-foreground" />}
          title="No saved jobs yet"
          description="You haven't bookmarked any jobs yet. Browse marketplace jobs to save your favorites."
          action={{ label: "Browse Jobs", href: "/find-jobs" }}
        />
      )}
    </div>
  );
}

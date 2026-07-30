"use client";

import React, { useEffect, useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { JobCard } from "@/components/shared/JobCard";
import { EmptyState } from "@/components/shared/EmptyState";
import { Bookmark, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { jobService } from "@/lib/services/job.service";
import { toast } from "sonner";

export default function SavedJobsPage() {
  const [savedJobs, setSavedJobs] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSavedJobs();
  }, []);

  const fetchSavedJobs = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await jobService.getSavedJobs();
      setSavedJobs(Array.isArray(data) ? data : []);
    } catch (err: any) {
      console.error("Failed to load saved jobs", err);
      setError("Unable to load saved jobs. Please sign in as candidate.");
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
      ) : error ? (
        <div className="p-8 text-center text-red-600 border rounded-xl bg-red-50/50">
          <p>{error}</p>
          <button
            onClick={fetchSavedJobs}
            className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md text-xs font-semibold"
          >
            Retry
          </button>
        </div>
      ) : filteredJobs.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
          {filteredJobs.map((job) => (
            <div key={job.id} className="relative group">
              <JobCard job={job} />
              <button
                onClick={() => handleUnsave(job.id)}
                className="absolute top-3 right-3 text-xs text-red-500 bg-background/80 hover:bg-red-50 p-1.5 rounded-md border"
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
          title="No saved jobs"
          description="You haven't saved any jobs yet. Start browsing to find your next opportunity."
          action={{ label: "Browse Jobs", href: "/find-jobs" }}
        />
      )}
    </div>
  );
}

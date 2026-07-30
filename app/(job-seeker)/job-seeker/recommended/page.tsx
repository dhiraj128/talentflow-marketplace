"use client";

import React, { useEffect, useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { JobCard } from "@/components/shared/JobCard";
import { EmptyState } from "@/components/shared/EmptyState";
import { Sparkles, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { jobService } from "@/lib/services/job.service";

export default function RecommendedJobsPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const fetchRecommendations = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await jobService.getJobs({ limit: 20 });
      const jobList = Array.isArray(data) ? data : data?.data || [];
      setJobs(jobList);
    } catch (err: any) {
      console.error("Failed to load recommended jobs", err);
      setError("Unable to load recommendations. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const filteredJobs = jobs.filter((j) =>
    searchTerm
      ? j.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        j.employer?.companyName?.toLowerCase().includes(searchTerm.toLowerCase())
      : true
  );

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8">
      <PageHeader
        title="Recommended for You"
        description="Job matches based on real active marketplace postings and profile criteria"
      />

      <div className="flex items-center gap-4 bg-card p-4 rounded-xl border">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Filter recommendations..."
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
            onClick={fetchRecommendations}
            className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md text-xs font-semibold"
          >
            Retry
          </button>
        </div>
      ) : filteredJobs.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredJobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<Sparkles className="h-10 w-10 text-muted-foreground" />}
          title="No recommendations available yet"
          description="We couldn't find matching active jobs right now. Check back soon or update your profile."
          action={{ label: "Update Profile", href: "/job-seeker/profile" }}
        />
      )}
    </div>
  );
}

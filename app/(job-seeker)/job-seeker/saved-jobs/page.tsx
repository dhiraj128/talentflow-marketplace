"use client";

import { PageHeader } from "@/components/shared/PageHeader";
import { JobCard } from "@/components/shared/JobCard";
import { EmptyState } from "@/components/shared/EmptyState";
import { Bookmark, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

const SAVED_JOBS = [
  { id: "1", title: "Senior React Developer", company: "TechCorp Inc.", location: "San Francisco, CA", salary: "$120k - $160k", type: "Full-time", posted: "2 days ago", match: 95 },
  { id: "2", title: "Full Stack Engineer", company: "StartupHub", location: "Remote", salary: "$100k - $140k", type: "Full-time", posted: "1 day ago", match: 88 },
];

export default function SavedJobsPage() {
  return (
    <div className="max-w-7xl mx-auto p-8 space-y-8">
      <PageHeader 
        title="Saved Jobs" 
        description="Jobs you have bookmarked for later"
      />

      <div className="flex items-center gap-4 bg-card p-4 rounded-xl border">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search saved jobs..." className="pl-9" />
        </div>
      </div>

      {SAVED_JOBS.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SAVED_JOBS.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<Bookmark className="h-10 w-10 text-muted-foreground" />}
          title="No saved jobs"
          description="You haven't saved any jobs yet. Start browsing to find your next opportunity."
          action={{ label: "Browse Jobs", href: "/talent" }}
        />
      )}
    </div>
  );
}

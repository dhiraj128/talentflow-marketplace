"use client";

import { PageHeader } from "@/components/shared/PageHeader";
import { JobCard } from "@/components/shared/JobCard";
import { EmptyState } from "@/components/shared/EmptyState";
import { Sparkles, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

const RECOMMENDED_JOBS = [
  { id: "1", title: "Frontend Tech Lead", company: "InnovateTech", location: "Remote", salary: "$140k - $180k", type: "Full-time", posted: "2 hours ago", match: 98 },
  { id: "2", title: "Senior React Developer", company: "TechCorp Inc.", location: "San Francisco, CA", salary: "$120k - $160k", type: "Full-time", posted: "2 days ago", match: 95 },
  { id: "3", title: "Full Stack Engineer", company: "StartupHub", location: "Remote", salary: "$100k - $140k", type: "Full-time", posted: "1 day ago", match: 88 },
];

export default function RecommendedJobsPage() {
  return (
    <div className="max-w-7xl mx-auto p-8 space-y-8">
      <PageHeader 
        title="Recommended for You" 
        description="Job matches based on your profile and preferences"
      />

      <div className="flex items-center gap-4 bg-card p-4 rounded-xl border">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Filter recommendations..." className="pl-9" />
        </div>
      </div>

      {RECOMMENDED_JOBS.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {RECOMMENDED_JOBS.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<Sparkles className="h-10 w-10 text-muted-foreground" />}
          title="No recommendations yet"
          description="Complete your profile to get personalized job recommendations."
          action={{ label: "Update Profile", href: "/job-seeker/profile" }}
        />
      )}
    </div>
  );
}

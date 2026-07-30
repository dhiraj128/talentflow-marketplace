"use client";

import React, { useEffect, useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { JobCard } from "@/components/shared/JobCard";
import { EmptyState } from "@/components/shared/EmptyState";
import { Sparkles, Search, Lock, ShieldAlert, RefreshCw, Zap } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { jobService } from "@/lib/services/job.service";
import { useAuth } from "@/lib/auth-context";

export default function RecommendedJobsPage() {
  const { user } = useAuth();
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [statusState, setStatusState] = useState<"IDLE" | "SUCCESS" | "UNAUTH" | "FORBIDDEN" | "ERROR">("IDLE");

  useEffect(() => {
    fetchRecommendations();
  }, [user]);

  const fetchRecommendations = async () => {
    setIsLoading(true);
    setStatusState("IDLE");
    try {
      const res = await jobService.getRecommendedJobs();
      const list = Array.isArray(res) ? res : res?.data || [];
      setRecommendations(list);
      setStatusState("SUCCESS");
    } catch (err: any) {
      console.error("Failed to load recommendations", err);
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

  const filtered = recommendations.filter((r) => {
    const job = r.job || r;
    return searchTerm
      ? job.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.company?.toLowerCase().includes(searchTerm.toLowerCase())
      : true;
  });

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8">
      <PageHeader
        title="Recommended for You"
        description="Job matches calculated deterministically from active marketplace roles and candidate criteria"
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
      ) : statusState === "UNAUTH" ? (
        <div className="p-12 text-center border rounded-xl bg-card space-y-4">
          <Lock className="w-12 h-12 text-muted-foreground mx-auto" />
          <h3 className="text-xl font-bold">Sign in to view recommendations</h3>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            Please sign in with your candidate account to get personalized job recommendations.
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
            Recommendations are tailored to candidate profiles. Please log in as a candidate.
          </p>
        </div>
      ) : statusState === "ERROR" ? (
        <div className="p-8 text-center text-red-600 border border-red-200 rounded-xl bg-red-50/50 space-y-3">
          <p className="font-semibold">Unable to load recommendations. Please try again.</p>
          <Button variant="outline" size="sm" onClick={fetchRecommendations} className="gap-2">
            <RefreshCw className="w-4 h-4" /> Retry
          </Button>
        </div>
      ) : filtered.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((item) => {
            const job = item.job || item;
            const matchScore = item.matchScore || job.matchScore || 50;
            const reasons = item.matchingReasons || job.matchingReasons || [];

            return (
              <div key={job.id} className="space-y-2">
                <div className="flex items-center justify-between px-1">
                  <Badge variant="outline" className="bg-green-500/10 text-green-700 border-green-300 font-semibold gap-1">
                    <Zap className="w-3 h-3 text-green-600" /> {matchScore}% Match
                  </Badge>
                  <div className="flex gap-1">
                    {reasons.slice(0, 2).map((r: string, idx: number) => (
                      <span key={idx} className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                        {r}
                      </span>
                    ))}
                  </div>
                </div>
                <JobCard job={job} />
              </div>
            );
          })}
        </div>
      ) : (
        <EmptyState
          icon={<Sparkles className="h-10 w-10 text-muted-foreground" />}
          title="No job recommendations available yet"
          description="We couldn't find matching active jobs right now. Complete your profile skills or browse all marketplace jobs."
          action={{ label: "Update Profile", href: "/job-seeker/profile" }}
        />
      )}
    </div>
  );
}

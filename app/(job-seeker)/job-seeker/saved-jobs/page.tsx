"use client";

import React, { useEffect, useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { JobCard } from "@/components/shared/JobCard";
import { EmptyState } from "@/components/shared/EmptyState";
import { Bookmark, Search, Lock, ShieldAlert, RefreshCw, Bell, Trash2, Calendar, ExternalLink } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { jobService } from "@/lib/services/job.service";
import { SavedSearchesService, SavedSearchItem } from "@/lib/services/saved-searches.service";
import { JobAlertsService, JobAlertItem } from "@/lib/services/job-alerts.service";
import { useAuth } from "@/lib/auth-context";
import { toast } from "sonner";
import Link from "next/link";

export default function SavedJobsPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("jobs");

  // Saved Jobs State
  const [savedJobs, setSavedJobs] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoadingJobs, setIsLoadingJobs] = useState(true);
  const [statusState, setStatusState] = useState<"IDLE" | "SUCCESS" | "UNAUTH" | "FORBIDDEN" | "ERROR">("IDLE");

  // Saved Searches & Job Alerts State
  const [savedSearches, setSavedSearches] = useState<SavedSearchItem[]>([]);
  const [jobAlerts, setJobAlerts] = useState<JobAlertItem[]>([]);
  const [isLoadingSearches, setIsLoadingSearches] = useState(false);

  useEffect(() => {
    fetchSavedJobs();
    if (user?.role === "job-seeker" || user?.role === "employer" || (user?.role as string) === "CANDIDATE") {
      fetchSavedSearchesAndAlerts();
    }
  }, [user]);

  const fetchSavedJobs = async () => {
    setIsLoadingJobs(true);
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
      setIsLoadingJobs(false);
    }
  };

  const fetchSavedSearchesAndAlerts = async () => {
    setIsLoadingSearches(true);
    try {
      const [searches, alerts] = await Promise.all([
        SavedSearchesService.getAll().catch(() => []),
        JobAlertsService.getAll().catch(() => []),
      ]);
      setSavedSearches(searches);
      setJobAlerts(alerts);
    } catch (err) {
      console.warn("Failed to load saved searches/alerts", err);
    } finally {
      setIsLoadingSearches(false);
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

  const handleDeleteSearch = async (id: string) => {
    try {
      await SavedSearchesService.delete(id);
      toast.success("Saved search deleted");
      fetchSavedSearchesAndAlerts();
    } catch (err) {
      toast.error("Failed to delete saved search");
    }
  };

  const handleDeleteAlert = async (id: string) => {
    try {
      await JobAlertsService.delete(id);
      toast.success("Job alert deleted");
      fetchSavedSearchesAndAlerts();
    } catch (err) {
      toast.error("Failed to delete job alert");
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
        title="Saved Jobs & Job Alerts"
        description="Manage your bookmarked positions, saved searches, and automated job alert preferences."
      />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="jobs" className="font-semibold flex items-center gap-2">
            <Bookmark className="h-4 w-4" /> Saved Jobs ({savedJobs.length})
          </TabsTrigger>
          <TabsTrigger value="searches" className="font-semibold flex items-center gap-2">
            <Bell className="h-4 w-4" /> Searches & Alerts ({savedSearches.length})
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Saved Jobs */}
        <TabsContent value="jobs" className="mt-6 space-y-6">
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

          {isLoadingJobs ? (
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
              <ShieldAlert className="w-12 h-12 text-destructive mx-auto" />
              <h3 className="text-xl font-bold">Candidate Account Required</h3>
              <p className="text-sm text-muted-foreground max-w-md mx-auto">
                Saved jobs management is exclusive to candidate accounts.
              </p>
            </div>
          ) : statusState === "ERROR" ? (
            <div className="p-12 text-center border rounded-xl bg-card space-y-4">
              <ShieldAlert className="w-12 h-12 text-amber-500 mx-auto" />
              <h3 className="text-xl font-bold">Failed to load saved jobs</h3>
              <p className="text-sm text-muted-foreground max-w-md mx-auto">
                There was a network or server error loading your saved jobs.
              </p>
              <Button onClick={fetchSavedJobs} variant="outline" className="mt-2 gap-2">
                <RefreshCw className="h-4 w-4" /> Try Again
              </Button>
            </div>
          ) : filteredJobs.length === 0 ? (
            <EmptyState
              icon={<Bookmark className="h-6 w-6" />}
              title="No saved jobs"
              description={
                searchTerm
                  ? "No saved jobs match your search criteria."
                  : "You haven't bookmarked any jobs yet. Browse available positions and save ones you like!"
              }
              actionLabel={searchTerm ? "Clear Search" : "Browse Jobs"}
              onAction={() => (searchTerm ? setSearchTerm("") : (window.location.href = "/find-jobs"))}
            />
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredJobs.map((job) => (
                <div key={job.id} className="relative group">
                  <JobCard job={job} />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleUnsave(job.id)}
                    className="absolute top-4 right-4 bg-background/80 backdrop-blur border text-xs text-destructive hover:bg-destructive/10"
                  >
                    Remove
                  </Button>
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Tab 2: Saved Searches & Job Alerts */}
        <TabsContent value="searches" className="mt-6 space-y-6">
          {isLoadingSearches ? (
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <div key={i} className="h-28 rounded-xl border bg-muted/20 animate-pulse p-4" />
              ))}
            </div>
          ) : savedSearches.length === 0 ? (
            <EmptyState
              icon={<Bell className="h-6 w-6" />}
              title="No Saved Searches or Alerts"
              description="You haven't saved any job searches yet. Search for jobs on the marketplace and click 'Save Search' to receive automated email alerts!"
              actionLabel="Search Jobs & Save"
              onAction={() => (window.location.href = "/find-jobs")}
            />
          ) : (
            <div className="space-y-4">
              {savedSearches.map((s) => {
                const alert = jobAlerts.find((a) => a.savedSearchId === s.id);
                const queryStr = s.queryJson?.q || "All Jobs";
                const locStr = s.queryJson?.location || "Any Location";

                return (
                  <div key={s.id} className="bg-card border rounded-2xl p-5 shadow-sm space-y-3">
                    <div className="flex items-start justify-between flex-wrap gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-base text-foreground">{s.name}</h3>
                          <Badge variant="outline" className="text-xs">
                            {s.searchType}
                          </Badge>
                          {alert && (
                            <Badge variant="default" className="text-xs bg-amber-500 hover:bg-amber-600">
                              <Bell className="h-3 w-3 mr-1" /> {alert.frequency} Alert
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          Created on {new Date(s.createdAt).toLocaleDateString()}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <Link
                          href={`/find-jobs?q=${encodeURIComponent(s.queryJson?.q || "")}&location=${encodeURIComponent(s.queryJson?.location || "")}`}
                        >
                          <Button variant="outline" size="sm" className="h-8 text-xs gap-1">
                            <ExternalLink className="h-3.5 w-3.5" /> Run Search
                          </Button>
                        </Link>
                        {alert && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteAlert(alert.id)}
                            className="h-8 text-xs text-amber-600 hover:bg-amber-50"
                          >
                            Disable Alert
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteSearch(s.id)}
                          className="h-8 text-xs text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="h-3.5 w-3.5 mr-1" /> Delete
                        </Button>
                      </div>
                    </div>

                    <div className="bg-muted/30 p-3 rounded-xl border flex flex-wrap gap-2 text-xs">
                      <span className="font-semibold text-foreground">Criteria:</span>
                      <span className="text-muted-foreground">Keyword: <strong>{queryStr}</strong></span>
                      <span className="text-muted-foreground">• Location: <strong>{locStr}</strong></span>
                      {s.queryJson?.type && (
                        <span className="text-muted-foreground">• Type: <strong>{Array.isArray(s.queryJson.type) ? s.queryJson.type.join(", ") : s.queryJson.type}</strong></span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

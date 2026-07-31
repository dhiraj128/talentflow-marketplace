"use client";

import React, { useState } from "react";
import { Bookmark, Bell, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SavedSearchesService } from "@/lib/services/saved-searches.service";
import { JobAlertsService } from "@/lib/services/job-alerts.service";
import { useAuth } from "@/lib/auth-context";
import { toast } from "sonner";

interface SaveSearchModalProps {
  queryFilters: Record<string, any>;
  trigger?: React.ReactNode;
}

export function SaveSearchModal({ queryFilters, trigger }: SaveSearchModalProps) {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [enableAlert, setEnableAlert] = useState(true);
  const [frequency, setFrequency] = useState<"DAILY" | "WEEKLY">("DAILY");
  const [submitting, setSubmitting] = useState(false);

  const defaultName =
    queryFilters.q || queryFilters.location
      ? `${queryFilters.q || "Jobs"} ${queryFilters.location ? `in ${queryFilters.location}` : ""}`.trim()
      : "My Job Search";

  const handleOpen = () => {
    if (!user) {
      toast.error("Please sign in as a job seeker to save searches.");
      return;
    }
    setName(defaultName);
    setOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Please enter a name for your saved search.");
      return;
    }

    setSubmitting(true);
    try {
      const saved = await SavedSearchesService.create({
        name: name.trim(),
        searchType: "JOB",
        queryJson: queryFilters,
      });

      if (enableAlert && ((user?.role as string) === "CANDIDATE" || user?.role === "job-seeker")) {
        await JobAlertsService.create({
          name: name.trim(),
          queryJson: queryFilters,
          frequency,
          savedSearchId: saved.id,
        });
      }

      toast.success(
        enableAlert
          ? "Search saved and job alert activated!"
          : "Search criteria saved successfully!"
      );
      setOpen(false);
    } catch (err: any) {
      toast.error(err.message || "Failed to save search.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger onClick={handleOpen}>
        {trigger || (
          <Button variant="outline" size="sm" type="button" className="gap-1.5 text-xs font-semibold">
            <Bookmark className="h-3.5 w-3.5 text-blue-600" /> Save Search
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bookmark className="h-5 w-5 text-blue-600" /> Save Search & Create Alert
          </DialogTitle>
          <DialogDescription>
            Save your current filters and optionally receive automated email alerts for new matching jobs.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Saved Search Name</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Remote React Developer Jobs"
              required
            />
          </div>

          <div className="bg-muted/40 p-3 rounded-xl border space-y-2 text-xs text-muted-foreground">
            <p className="font-semibold text-foreground">Current Active Filters:</p>
            <div className="flex flex-wrap gap-1.5">
              {Object.entries(queryFilters).map(([k, v]) => {
                if (!v) return null;
                return (
                  <span key={k} className="bg-background px-2 py-0.5 rounded border text-[11px] font-medium text-foreground">
                    {k}: {Array.isArray(v) ? v.join(", ") : String(v)}
                  </span>
                );
              })}
            </div>
          </div>

          {((user?.role as string) === "CANDIDATE" || user?.role === "job-seeker") && (
            <div className="space-y-3 pt-2 border-t">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <label className="text-sm font-medium flex items-center gap-1.5">
                    <Bell className="h-4 w-4 text-amber-500" /> Enable Email Alerts
                  </label>
                  <p className="text-xs text-muted-foreground">
                    Get notified when new jobs match these criteria.
                  </p>
                </div>
                <Switch checked={enableAlert} onCheckedChange={setEnableAlert} />
              </div>

              {enableAlert && (
                <div className="space-y-1.5 pt-1">
                  <label className="text-xs font-medium">Alert Frequency</label>
                  <Select value={frequency} onValueChange={(val: any) => setFrequency(val || "DAILY")}>
                    <SelectTrigger className="h-9 text-xs">
                      <SelectValue placeholder="Frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="DAILY">Daily Digest</SelectItem>
                      <SelectItem value="WEEKLY">Weekly Summary</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          )}

          <DialogFooter className="pt-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={submitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Search
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

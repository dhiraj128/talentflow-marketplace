"use client";

import React, { useEffect, useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { ReviewsService, ReviewItem, ReviewStatus, ReviewReportStatus } from "@/lib/services/reviews.service";
import { StarRating } from "@/features/reviews/StarRating";
import { VerifiedReviewBadge } from "@/features/reviews/VerifiedReviewBadge";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { ShieldAlert, CheckCircle2, EyeOff, Trash2, RefreshCw, AlertTriangle, Loader2 } from "lucide-react";

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");

  const fetchData = async () => {
    setLoading(true);
    try {
      const [revData, repData] = await Promise.all([
        ReviewsService.getAdminReviews(),
        ReviewsService.getAdminReports(),
      ]);
      setReviews(revData);
      setReports(repData);
    } catch (err: any) {
      toast.error(err.message || "Failed to fetch reviews.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleModerate = async (id: string, status: ReviewStatus) => {
    try {
      await ReviewsService.moderateReview(id, status);
      toast.success(`Review status updated to ${status}.`);
      fetchData();
    } catch (err: any) {
      toast.error(err.message || "Failed to update review status.");
    }
  };

  const handleResolveReport = async (reportId: string, status: ReviewReportStatus) => {
    try {
      await ReviewsService.resolveReport(reportId, status);
      toast.success(`Report status updated to ${status}.`);
      fetchData();
    } catch (err: any) {
      toast.error(err.message || "Failed to resolve report.");
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <PageHeader
          title="Review Moderation & Trust System"
          description="Moderate user reviews, manage reports, and ensure marketplace integrity."
        />
        <Button variant="outline" size="sm" onClick={fetchData} disabled={loading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} /> Refresh
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="all" className="font-semibold">
            All Reviews ({reviews.length})
          </TabsTrigger>
          <TabsTrigger value="reports" className="font-semibold relative">
            Reported Reviews ({reports.length})
            {reports.filter(r => r.status === "OPEN").length > 0 && (
              <span className="ml-2 px-1.5 py-0.5 rounded-full bg-red-600 text-white text-[10px] font-bold">
                {reports.filter(r => r.status === "OPEN").length}
              </span>
            )}
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: All Reviews */}
        <TabsContent value="all" className="mt-6 space-y-4">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : reviews.length === 0 ? (
            <div className="text-center py-12 border rounded-2xl bg-card">
              <p className="text-muted-foreground">No reviews found in the marketplace.</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {reviews.map((rev) => (
                <div key={rev.id} className="bg-card border rounded-2xl p-5 space-y-3 shadow-sm">
                  <div className="flex items-start justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-3">
                      <StarRating rating={rev.rating} size="sm" />
                      <span className="font-semibold text-sm">{rev.reviewer?.email || "Reviewer"}</span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(rev.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <VerifiedReviewBadge relationshipType={rev.relationshipType} />
                      <Badge variant={rev.status === "PUBLISHED" ? "default" : rev.status === "HIDDEN" ? "secondary" : "destructive"}>
                        {rev.status}
                      </Badge>
                    </div>
                  </div>

                  {rev.title && <h4 className="font-semibold text-sm">{rev.title}</h4>}
                  <p className="text-sm text-foreground/90">{rev.comment}</p>

                  <div className="flex items-center justify-end gap-2 pt-2 border-t text-xs">
                    {rev.status !== "PUBLISHED" && (
                      <Button variant="outline" size="sm" onClick={() => handleModerate(rev.id, "PUBLISHED")} className="h-8 text-xs">
                        <CheckCircle2 className="h-3.5 w-3.5 mr-1 text-emerald-600" /> Publish
                      </Button>
                    )}
                    {rev.status !== "HIDDEN" && (
                      <Button variant="outline" size="sm" onClick={() => handleModerate(rev.id, "HIDDEN")} className="h-8 text-xs">
                        <EyeOff className="h-3.5 w-3.5 mr-1" /> Hide
                      </Button>
                    )}
                    {rev.status !== "REMOVED" && (
                      <Button variant="destructive" size="sm" onClick={() => handleModerate(rev.id, "REMOVED")} className="h-8 text-xs">
                        <Trash2 className="h-3.5 w-3.5 mr-1" /> Remove
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Tab 2: Reported Reviews */}
        <TabsContent value="reports" className="mt-6 space-y-4">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : reports.length === 0 ? (
            <div className="text-center py-12 border rounded-2xl bg-card">
              <p className="text-muted-foreground">No reports pending moderation.</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {reports.map((rep) => (
                <div key={rep.id} className="bg-card border border-red-200 dark:border-red-900/50 rounded-2xl p-5 space-y-3 shadow-sm">
                  <div className="flex items-start justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2 text-destructive font-semibold text-sm">
                      <AlertTriangle className="h-4 w-4" />
                      <span>Reason: {rep.reason}</span>
                    </div>

                    <Badge variant={rep.status === "OPEN" ? "destructive" : "secondary"}>
                      {rep.status}
                    </Badge>
                  </div>

                  {rep.details && (
                    <p className="text-xs text-muted-foreground bg-muted/40 p-2.5 rounded-lg border">
                      <strong>Reporter Details:</strong> {rep.details}
                    </p>
                  )}

                  {rep.review && (
                    <div className="bg-muted/20 border p-3 rounded-xl space-y-1">
                      <div className="flex items-center gap-2">
                        <StarRating rating={rep.review.rating} size="sm" />
                        <span className="text-xs font-semibold">{rep.review.reviewer?.email}</span>
                      </div>
                      <p className="text-xs text-foreground">{rep.review.comment}</p>
                    </div>
                  )}

                  <div className="flex items-center justify-end gap-2 pt-2 border-t text-xs">
                    {rep.status === "OPEN" && (
                      <>
                        <Button variant="outline" size="sm" onClick={() => handleResolveReport(rep.id, "DISMISSED")} className="h-8 text-xs">
                          Dismiss Report
                        </Button>
                        <Button variant="default" size="sm" onClick={() => handleResolveReport(rep.id, "RESOLVED")} className="h-8 text-xs">
                          <CheckCircle2 className="h-3.5 w-3.5 mr-1" /> Resolve Report
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => handleModerate(rep.reviewId, "REMOVED")} className="h-8 text-xs">
                          <Trash2 className="h-3.5 w-3.5 mr-1" /> Remove Review
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>

      </Tabs>
    </div>
  );
}

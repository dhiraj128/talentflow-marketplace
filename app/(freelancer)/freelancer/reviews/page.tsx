"use client";

import React, { useEffect, useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatsGrid } from "@/components/shared/StatsGrid";
import { MetricCard } from "@/components/shared/MetricCard";
import { Star, MessageSquare } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { analyticsService } from "@/lib/services/analytics.service";
import { Skeleton } from "@/components/ui/skeleton";

export default function ReviewsPage() {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    analyticsService.getFreelancerDashboard()
      .then((res) => {
        setData(res);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load reviews", err);
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto p-8 space-y-8">
        <Skeleton className="h-12 w-64" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Skeleton className="h-28 w-full" />
          <Skeleton className="h-28 w-full" />
        </div>
      </div>
    );
  }

  const reviews = data?.reviews || [];
  const rating = data?.stats?.rating ?? 0;
  const reviewCount = reviews.length;

  return (
    <div className="max-w-7xl mx-auto p-8 space-y-8">
      <PageHeader 
        title="Reviews & Feedback" 
        description="See what clients are saying about your work."
      />

      <StatsGrid columns={2}>
        <MetricCard title="Overall Rating" value={rating > 0 ? rating.toFixed(1) : "0.0"} icon={<Star className="w-4 h-4 text-yellow-500 fill-current" />} description={`Based on ${reviewCount} review${reviewCount === 1 ? '' : 's'}`} />
        <MetricCard title="Total Reviews" value={reviewCount.toString()} icon={<Star className="w-4 h-4" />} />
      </StatsGrid>

      <div className="space-y-6">
        <h3 className="text-xl font-semibold">Client Feedback</h3>
        
        {reviews.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center p-12 text-center">
              <MessageSquare className="w-12 h-12 text-muted-foreground/40 mb-3" />
              <h4 className="font-semibold text-lg">No reviews yet</h4>
              <p className="text-sm text-muted-foreground mt-1">Client reviews and feedback will appear here after completing project milestones.</p>
            </CardContent>
          </Card>
        ) : (
          reviews.map((rev: any) => (
            <Card key={rev.id}>
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="font-semibold text-lg">{rev.title || "Project Review"}</h4>
                    <p className="text-sm text-muted-foreground">Client: {rev.clientName} • {new Date(rev.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="flex text-yellow-500">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className={`w-4 h-4 ${star <= rev.rating ? "fill-current" : "text-muted"}`} />
                    ))}
                  </div>
                </div>
                <p className="text-sm">{rev.comment}</p>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

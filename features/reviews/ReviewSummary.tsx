"use client";

import React from "react";
import { StarRating } from "./StarRating";
import { RatingSummary } from "@/lib/services/reviews.service";
import { Progress } from "@/components/ui/progress";

interface ReviewSummaryProps {
  summary: RatingSummary;
  title?: string;
}

export function ReviewSummary({ summary, title = "Customer & Learner Reviews" }: ReviewSummaryProps) {
  const { averageRating, totalReviews, ratingDistribution } = summary;

  if (totalReviews === 0) {
    return (
      <div className="bg-card rounded-2xl border p-6 text-center">
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-muted-foreground text-sm mb-4">No reviews yet</p>
        <StarRating rating={0} size="md" className="justify-center" />
      </div>
    );
  }

  return (
    <div className="bg-card rounded-2xl border p-6 shadow-sm">
      <h3 className="text-lg font-semibold mb-6">{title}</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
        
        {/* Average Score */}
        <div className="flex flex-col items-center justify-center p-4 bg-muted/40 rounded-xl border text-center">
          <span className="text-5xl font-extrabold text-foreground tracking-tight mb-2">
            {averageRating.toFixed(1)}
          </span>
          <StarRating rating={averageRating} size="lg" className="mb-2" />
          <span className="text-sm font-medium text-muted-foreground">
            Based on {totalReviews} verified review{totalReviews > 1 ? "s" : ""}
          </span>
        </div>

        {/* Rating Breakdown Bars */}
        <div className="md:col-span-2 space-y-2">
          {[5, 4, 3, 2, 1].map((stars) => {
            const count = ratingDistribution[stars as 1 | 2 | 3 | 4 | 5] || 0;
            const percentage = totalReviews > 0 ? Math.round((count / totalReviews) * 100) : 0;

            return (
              <div key={stars} className="flex items-center gap-3 text-sm">
                <span className="w-12 font-medium flex items-center gap-1 text-muted-foreground shrink-0">
                  {stars} <span className="text-yellow-400">★</span>
                </span>
                <Progress value={percentage} className="h-2.5 flex-1 bg-muted" />
                <span className="w-12 text-right font-semibold text-foreground shrink-0">
                  {percentage}%
                </span>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}

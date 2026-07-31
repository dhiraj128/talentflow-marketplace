"use client";

import React, { useState } from "react";
import { StarRating } from "./StarRating";
import { VerifiedReviewBadge } from "./VerifiedReviewBadge";
import { ReportReviewDialog } from "./ReportReviewDialog";
import { ReviewItem, ReviewsService } from "@/lib/services/reviews.service";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Loader2 } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { toast } from "sonner";

interface ReviewCardProps {
  review: ReviewItem;
  onRefresh?: () => void;
  onEdit?: (review: ReviewItem) => void;
}

export function ReviewCard({ review, onRefresh, onEdit }: ReviewCardProps) {
  const { user } = useAuth();
  const [deleting, setDeleting] = useState(false);

  const isAuthor = user?.id === review.reviewerUserId || user?.role === "admin";
  const authorName =
    review.reviewer?.candidateProfile?.fullName ||
    review.reviewer?.employerProfile?.companyName ||
    review.reviewer?.email?.split("@")[0] ||
    "Marketplace User";

  const authorInitials = authorName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

  const formattedDate = new Date(review.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this review?")) return;
    setDeleting(true);

    try {
      await ReviewsService.deleteReview(review.id);
      toast.success("Review deleted successfully.");
      if (onRefresh) onRefresh();
    } catch (err: any) {
      toast.error(err.message || "Failed to delete review.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="bg-card rounded-2xl border p-5 shadow-sm space-y-3 transition-all hover:border-gray-300 dark:hover:border-gray-700">
      
      {/* Header: Author Info & Verified Badge */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10 border">
            <AvatarImage src={review.reviewer?.avatarUrl || undefined} alt={authorName} />
            <AvatarFallback className="font-semibold bg-muted text-foreground">
              {authorInitials}
            </AvatarFallback>
          </Avatar>
          <div>
            <h4 className="font-semibold text-sm leading-none mb-1">{authorName}</h4>
            <span className="text-xs text-muted-foreground">{formattedDate}</span>
          </div>
        </div>

        <VerifiedReviewBadge relationshipType={review.relationshipType} />
      </div>

      {/* Rating Stars & Title */}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <StarRating rating={review.rating} size="sm" />
          {review.title && <h5 className="font-semibold text-sm text-foreground">{review.title}</h5>}
        </div>
      </div>

      {/* Review Comment */}
      <p className="text-sm text-foreground/90 leading-relaxed whitespace-pre-line">
        {review.comment}
      </p>

      {/* Footer Actions: Edit/Delete for Author, Report for others */}
      <div className="flex items-center justify-end gap-2 pt-2 border-t text-xs">
        {isAuthor ? (
          <>
            {onEdit && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(review)}
                className="h-8 px-2.5 text-xs text-muted-foreground hover:text-foreground"
              >
                <Pencil className="h-3.5 w-3.5 mr-1" /> Edit
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDelete}
              disabled={deleting}
              className="h-8 px-2.5 text-xs text-destructive hover:bg-destructive/10"
            >
              {deleting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5 mr-1" />} Delete
            </Button>
          </>
        ) : (
          <ReportReviewDialog reviewId={review.id} />
        )}
      </div>

    </div>
  );
}

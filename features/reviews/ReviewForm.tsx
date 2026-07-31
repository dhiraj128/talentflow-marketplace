"use client";

import React, { useState, useEffect } from "react";
import { StarRating } from "./StarRating";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, MessageSquarePlus } from "lucide-react";
import {
  ReviewsService,
  ReviewItem,
  ReviewRelationshipType,
} from "@/lib/services/reviews.service";
import { toast } from "sonner";

interface ReviewFormProps {
  relationshipType: ReviewRelationshipType;
  relationshipId: string;
  subjectUserId?: string;
  courseId?: string;
  existingReview?: ReviewItem | null;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function ReviewForm({
  relationshipType,
  relationshipId,
  subjectUserId,
  courseId,
  existingReview,
  onSuccess,
  onCancel,
}: ReviewFormProps) {
  const [rating, setRating] = useState(existingReview?.rating || 5);
  const [title, setTitle] = useState(existingReview?.title || "");
  const [comment, setComment] = useState(existingReview?.comment || "");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (existingReview) {
      setRating(existingReview.rating);
      setTitle(existingReview.title || "");
      setComment(existingReview.comment);
    }
  }, [existingReview]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!comment.trim()) {
      toast.error("Please enter your review text.");
      return;
    }

    setSubmitting(true);

    try {
      if (existingReview) {
        await ReviewsService.updateReview(existingReview.id, {
          rating,
          title: title.trim() || undefined,
          comment: comment.trim(),
        });
        toast.success("Your review has been updated successfully.");
      } else {
        await ReviewsService.createReview({
          relationshipType,
          relationshipId,
          subjectUserId,
          courseId,
          rating,
          title: title.trim() || undefined,
          comment: comment.trim(),
        });
        toast.success("Thank you! Your verified review has been published.");
      }

      if (onSuccess) onSuccess();
    } catch (err: any) {
      toast.error(err.message || "Failed to submit review.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-card rounded-2xl border p-6 space-y-4 shadow-sm">
      <div className="flex items-center justify-between border-b pb-3">
        <h3 className="font-semibold text-lg flex items-center gap-2">
          <MessageSquarePlus className="h-5 w-5 text-blue-600" />
          {existingReview ? "Edit Your Review" : "Write a Verified Review"}
        </h3>
        {onCancel && (
          <Button type="button" variant="ghost" size="sm" onClick={onCancel} disabled={submitting}>
            Cancel
          </Button>
        )}
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-medium">Your Rating</label>
        <div>
          <StarRating rating={rating} size="lg" interactive onChange={setRating} />
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-medium">Review Title (Optional)</label>
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Summarize your experience (e.g., Exceptional collaborator, highly recommended)"
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-medium">Written Review</label>
        <Textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Share constructive feedback based on your real experience..."
          rows={4}
          required
        />
      </div>

      <div className="flex items-center justify-end gap-3 pt-2">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} disabled={submitting}>
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={submitting}>
          {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {existingReview ? "Update Review" : "Submit Review"}
        </Button>
      </div>
    </form>
  );
}

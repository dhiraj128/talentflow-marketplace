"use client";

import React, { useState } from "react";
import { ReviewSummary } from "./ReviewSummary";
import { ReviewCard } from "./ReviewCard";
import { ReviewForm } from "./ReviewForm";
import {
  ReviewItem,
  RatingSummary,
  ReviewRelationshipType,
} from "@/lib/services/reviews.service";
import { Button } from "@/components/ui/button";
import { PlusCircle, MessageSquare } from "lucide-react";

interface ReviewListProps {
  summary: RatingSummary;
  reviews: ReviewItem[];
  canReview?: boolean;
  relationshipType?: ReviewRelationshipType;
  relationshipId?: string;
  subjectUserId?: string;
  courseId?: string;
  onRefresh?: () => void;
  title?: string;
}

export function ReviewList({
  summary,
  reviews,
  canReview = false,
  relationshipType = "EMPLOYER_TO_CANDIDATE",
  relationshipId = "",
  subjectUserId,
  courseId,
  onRefresh,
  title = "Reviews & Reputation",
}: ReviewListProps) {
  const [showForm, setShowForm] = useState(false);
  const [editingReview, setEditingReview] = useState<ReviewItem | null>(null);

  const handleEdit = (rev: ReviewItem) => {
    setEditingReview(rev);
    setShowForm(true);
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingReview(null);
    if (onRefresh) onRefresh();
  };

  return (
    <div className="space-y-6">
      
      {/* Header Bar */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-blue-600" />
          {title}
        </h2>
        
        {canReview && !showForm && (
          <Button onClick={() => { setEditingReview(null); setShowForm(true); }} className="gap-2">
            <PlusCircle className="h-4 w-4" /> Leave a Review
          </Button>
        )}
      </div>

      {/* Review Creation / Editing Form */}
      {showForm && (
        <ReviewForm
          relationshipType={relationshipType}
          relationshipId={relationshipId}
          subjectUserId={subjectUserId}
          courseId={courseId}
          existingReview={editingReview}
          onSuccess={handleFormSuccess}
          onCancel={() => { setShowForm(false); setEditingReview(null); }}
        />
      )}

      {/* Summary Score Card */}
      <ReviewSummary summary={summary} title={title} />

      {/* Reviews List */}
      {reviews.length === 0 ? (
        <div className="text-center py-10 border rounded-2xl bg-muted/20">
          <p className="text-muted-foreground font-medium text-sm">No verified reviews submitted yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((rev) => (
            <ReviewCard key={rev.id} review={rev} onRefresh={onRefresh} onEdit={handleEdit} />
          ))}
        </div>
      )}

    </div>
  );
}

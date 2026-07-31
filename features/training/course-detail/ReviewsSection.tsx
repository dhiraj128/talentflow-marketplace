"use client";

import React, { useEffect, useState } from "react";
import { ReviewList } from "@/features/reviews/ReviewList";
import { ReviewsService, ReviewListResponse } from "@/lib/services/reviews.service";

interface ReviewsSectionProps {
  courseId: string;
}

export function ReviewsSection({ courseId }: ReviewsSectionProps) {
  const [data, setData] = useState<ReviewListResponse>({
    summary: { averageRating: 0, totalReviews: 0, ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } },
    reviews: [],
  });

  const loadReviews = async () => {
    if (!courseId) return;
    const res = await ReviewsService.getReviewsForCourse(courseId);
    setData(res);
  };

  useEffect(() => {
    loadReviews();
  }, [courseId]);

  return (
    <ReviewList
      title="Student & Course Reviews"
      summary={data.summary}
      reviews={data.reviews}
      canReview={true}
      relationshipType="STUDENT_TO_COURSE"
      relationshipId={courseId}
      courseId={courseId}
      onRefresh={loadReviews}
    />
  );
}

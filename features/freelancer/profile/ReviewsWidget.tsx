import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { RatingStars } from "@/features/freelancer/shared/RatingStars";
import { Card, CardContent } from "@/components/ui/card";

interface Review {
  id: string;
  author: string;
  authorAvatar?: string;
  rating: number;
  date: string;
  comment: string;
}

interface ReviewsWidgetProps {
  reviews: Review[];
  averageRating: number;
  totalReviews: number;
}

export function ReviewsWidget({ reviews, averageRating, totalReviews }: ReviewsWidgetProps) {
  if (!reviews || reviews.length === 0) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b pb-2">
        <h3 className="font-semibold text-lg">Reviews & Ratings</h3>
        <RatingStars rating={averageRating} count={totalReviews} />
      </div>

      <div className="space-y-4">
        {reviews.map(review => (
          <Card key={review.id} className="border-none shadow-none bg-muted/20">
            <CardContent className="p-4 sm:p-5 space-y-3">
              <div className="flex justify-between items-start gap-4">
                <div className="flex items-center gap-3">
                  <Avatar className="w-10 h-10 border">
                    <AvatarImage src={review.authorAvatar} />
                    <AvatarFallback>{review.author.substring(0, 2)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-medium text-sm">{review.author}</h4>
                    <p className="text-xs text-muted-foreground">{review.date}</p>
                  </div>
                </div>
                <RatingStars rating={review.rating} />
              </div>
              <p className="text-sm text-foreground/80 leading-relaxed italic">
                "{review.comment}"
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

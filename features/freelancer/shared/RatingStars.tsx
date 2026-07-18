import React from "react";
import { Star, StarHalf } from "lucide-react";
import { cn } from "@/lib/utils";

interface RatingStarsProps {
  rating: number;
  count?: number;
  className?: string;
}

export function RatingStars({ rating, count, className }: RatingStarsProps) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className={cn("flex items-center gap-1", className)}>
      <div className="flex">
        {Array.from({ length: fullStars }).map((_, i) => (
          <Star key={`full-${i}`} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
        ))}
        {hasHalfStar && <StarHalf className="w-4 h-4 fill-yellow-400 text-yellow-400" />}
        {Array.from({ length: emptyStars }).map((_, i) => (
          <Star key={`empty-${i}`} className="w-4 h-4 text-muted-foreground/30" />
        ))}
      </div>
      {rating > 0 && <span className="font-medium text-sm ml-1">{rating.toFixed(1)}</span>}
      {count !== undefined && <span className="text-muted-foreground text-sm">({count})</span>}
    </div>
  );
}

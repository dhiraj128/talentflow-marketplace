import { Star, StarHalf } from "lucide-react";
import { cn } from "@/lib/utils";

interface RatingStarsProps {
  rating: number;
  max?: number;
  className?: string;
  starClassName?: string;
}

export function RatingStars({ rating, max = 5, className, starClassName }: RatingStarsProps) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = max - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className={cn("flex items-center gap-0.5", className)}>
      {Array.from({ length: fullStars }).map((_, i) => (
        <Star key={`full-${i}`} className={cn("w-4 h-4 fill-amber-400 text-amber-400", starClassName)} />
      ))}
      {hasHalfStar && <StarHalf className={cn("w-4 h-4 fill-amber-400 text-amber-400", starClassName)} />}
      {Array.from({ length: emptyStars }).map((_, i) => (
        <Star key={`empty-${i}`} className={cn("w-4 h-4 text-muted-foreground/30", starClassName)} />
      ))}
      <span className="ml-1 text-sm font-medium">{rating.toFixed(1)}</span>
    </div>
  );
}

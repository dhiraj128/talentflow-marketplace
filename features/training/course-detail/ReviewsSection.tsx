import { RatingStars } from "../shared/RatingStars";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Review {
  id: string;
  name: string;
  avatarUrl?: string;
  rating: number;
  date: string;
  comment: string;
}

export function ReviewsSection({ reviews }: { reviews: Review[] }) {
  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold">Student Reviews</h2>
      
      <div className="grid gap-6 md:grid-cols-2">
        {reviews.map((review) => (
          <div key={review.id} className="p-6 rounded-xl border border-border/60 bg-card">
            <div className="flex items-center gap-4 mb-4">
              <Avatar>
                <AvatarImage src={review.avatarUrl} alt={review.name} />
                <AvatarFallback>{review.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <h4 className="font-bold text-sm">{review.name}</h4>
                <div className="flex items-center gap-2 mt-0.5">
                  <RatingStars rating={review.rating} />
                  <span className="text-xs text-muted-foreground">{review.date}</span>
                </div>
              </div>
            </div>
            
            <p className="text-sm text-muted-foreground leading-relaxed">
              "{review.comment}"
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

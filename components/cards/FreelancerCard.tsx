import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, Clock } from "lucide-react";

export interface FreelancerCardProps {
  name: string;
  title: string;
  hourlyRate: string;
  rating: number;
  reviews: number;
  skills: string[];
}

export function FreelancerCard({ name, title, hourlyRate, rating, reviews, skills }: FreelancerCardProps) {
  return (
    <Card className="shadow-sm border group hover:border-primary transition-all">
      <CardContent className="p-6">
        <div className="flex items-start gap-4 mb-4">
          <div className="w-14 h-14 rounded-full overflow-hidden shrink-0 border bg-muted flex items-center justify-center">
             <span className="text-xl font-bold text-muted-foreground">{name.charAt(0)}</span>
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-start">
              <h5 className="text-lg font-bold text-foreground">{name}</h5>
              <div className="text-sm font-bold text-foreground flex items-center gap-1">
                {hourlyRate}<span className="text-xs text-muted-foreground font-normal">/hr</span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground line-clamp-1">{title}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4 mb-6">
          <div className="flex items-center text-sm font-medium text-amber-500">
            <Star className="h-4 w-4 fill-current mr-1" />
            {rating.toFixed(1)} <span className="text-muted-foreground font-normal ml-1">({reviews})</span>
          </div>
          <div className="flex items-center text-sm text-green-600 font-medium">
            <Clock className="h-4 w-4 mr-1" /> Available Now
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {skills.slice(0, 4).map((skill: string) => (
            <Badge key={skill} variant="outline" className="text-xs rounded-full px-2 py-0.5">
              {skill}
            </Badge>
          ))}
          {skills.length > 4 && (
            <Badge variant="outline" className="text-xs rounded-full px-2 py-0.5 border-dashed">
              +{skills.length - 4}
            </Badge>
          )}
        </div>
        
        <div className="flex gap-3">
          <Button className="flex-1 h-9 rounded-xl">Invite to Job</Button>
          <Button variant="outline" className="px-4 h-9 rounded-xl">Portfolio</Button>
        </div>
      </CardContent>
    </Card>
  );
}

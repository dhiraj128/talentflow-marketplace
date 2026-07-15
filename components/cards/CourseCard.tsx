import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, Users, Star } from "lucide-react";

export interface CourseCardProps {
  title: string;
  instructor: string;
  level: string;
  rating: number;
  students: number;
  duration: string;
  tags: string[];
}

export function CourseCard({ title, instructor, level, rating, students, duration, tags }: CourseCardProps) {
  return (
    <Card className="shadow-sm border group hover:border-primary transition-all overflow-hidden flex flex-col h-full">
      <div className="h-32 bg-muted relative flex items-center justify-center">
        <BookOpen className="h-10 w-10 text-muted-foreground/30" />
        <Badge className="absolute top-3 left-3 bg-background/80 text-foreground backdrop-blur-sm shadow-none">
          {level}
        </Badge>
      </div>
      <CardContent className="p-6 flex-1 flex flex-col">
        <h5 className="text-lg font-bold text-foreground mb-1 line-clamp-2">{title}</h5>
        <p className="text-sm text-muted-foreground mb-4">by {instructor}</p>
        
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center text-sm font-medium text-amber-500">
            <Star className="h-4 w-4 fill-current mr-1" />
            {rating.toFixed(1)}
          </div>
          <div className="flex items-center text-xs text-muted-foreground gap-3">
            <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" /> {students.toLocaleString()}</span>
            <span>{duration}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-6 mt-auto">
          {tags.map((tag: string) => (
            <Badge key={tag} variant="secondary" className="text-[10px] font-medium rounded">
              {tag}
            </Badge>
          ))}
        </div>
        
        <Button className="w-full h-9 rounded-xl">View Course</Button>
      </CardContent>
    </Card>
  );
}

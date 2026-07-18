import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Clock, BookOpen, Sparkles } from "lucide-react";
import Link from "next/link";
import { CourseLevelBadge } from "../shared/CourseLevelBadge";
import { RatingStars } from "../shared/RatingStars";

interface Course {
  id: string;
  title: string;
  instructor: string;
  rating: number;
  students: number;
  duration: string;
  level: string;
  price: number;
  thumbnail: string;
  isAiRecommended?: boolean;
  skills?: string[];
}

export function CourseCard({ course }: { course: Course }) {
  return (
    <Card className="flex flex-col h-full overflow-hidden group hover:shadow-lg transition-all border-muted/60">
      <div className="relative aspect-video overflow-hidden bg-muted">
        <img 
          src={course.thumbnail} 
          alt={course.title} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {course.isAiRecommended && (
          <div className="absolute top-3 left-3">
            <Badge className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm font-semibold gap-1 px-2.5 py-0.5">
              <Sparkles className="w-3 h-3" /> AI Recommended
            </Badge>
          </div>
        )}
      </div>
      
      <CardContent className="p-5 flex-1 flex flex-col">
        <div className="flex items-center justify-between mb-3">
          <CourseLevelBadge level={course.level as any} />
          <span className="text-lg font-bold">
            {course.price === 0 ? "Free" : `$${course.price}`}
          </span>
        </div>
        
        <h3 className="font-bold text-lg leading-tight mb-1.5 line-clamp-2 group-hover:text-blue-600 transition-colors">
          {course.title}
        </h3>
        
        <p className="text-sm text-muted-foreground mb-4">By {course.instructor}</p>
        
        <div className="mt-auto space-y-3">
          <div className="flex items-center gap-2">
            <RatingStars rating={course.rating} />
            <span className="text-xs text-muted-foreground">({course.students.toLocaleString()})</span>
          </div>
          
          <div className="flex items-center gap-4 text-xs font-medium text-muted-foreground pt-3 border-t">
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              <span>{course.duration}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5" />
              <span>{course.students >= 1000 ? `${(course.students/1000).toFixed(1)}k` : course.students}</span>
            </div>
          </div>
        </div>
      </CardContent>
      
      <div className="p-5 pt-0 mt-auto">
        <Link href={`/find-courses/${course.id}`} className="w-full">
          <div className="w-full py-2.5 rounded-md border text-center font-medium hover:bg-muted/50 transition-colors">
            View Details
          </div>
        </Link>
      </div>
    </Card>
  );
}

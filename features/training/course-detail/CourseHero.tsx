import { Badge } from "@/components/ui/badge";
import { Users, Clock, Globe, Award } from "lucide-react";
import { RatingStars } from "../shared/RatingStars";
import { CourseLevelBadge } from "../shared/CourseLevelBadge";

interface CourseHeroProps {
  course: any;
}

export function CourseHero({ course }: CourseHeroProps) {
  return (
    <div className="relative bg-slate-900 text-white overflow-hidden py-16 md:py-24">
      <div className="absolute inset-0 z-0">
        <img 
          src={course.thumbnail} 
          alt={course.title} 
          className="w-full h-full object-cover opacity-20 blur-sm"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/80 to-transparent" />
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl space-y-6">
          <div className="flex flex-wrap items-center gap-3">
            <CourseLevelBadge level={course.level} className="bg-white/20 text-white" />
            <Badge variant="outline" className="text-white border-white/30 backdrop-blur-md">
              {course.category}
            </Badge>
          </div>
          
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight leading-tight">
            {course.title}
          </h1>
          
          <p className="text-lg text-slate-300 md:text-xl line-clamp-2">
            {course.shortDescription}
          </p>
          
          <div className="flex flex-wrap items-center gap-4 text-sm font-medium">
            <div className="flex items-center gap-2 bg-black/30 px-3 py-1.5 rounded-full backdrop-blur-md">
              <span className="text-amber-400 font-bold">{course.rating.toFixed(1)}</span>
              <RatingStars rating={course.rating} className="hidden sm:flex" />
              <span className="text-slate-300">({course.reviews.toLocaleString()} reviews)</span>
            </div>
            
            <div className="flex items-center gap-1.5 text-slate-300">
              <Users className="w-4 h-4" /> {course.students.toLocaleString()} students
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-slate-300 pt-2">
            <span>Created by <span className="font-semibold text-white underline underline-offset-4 decoration-white/30 hover:decoration-white cursor-pointer">{course.instructor}</span></span>
          </div>
          
          <div className="flex flex-wrap items-center gap-6 pt-4 text-sm font-medium text-slate-300">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4" /> {course.language}
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" /> {course.duration}
            </div>
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4" /> Certificate of Completion
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

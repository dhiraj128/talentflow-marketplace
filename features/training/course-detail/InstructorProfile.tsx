import { Star, Users, Award, PlayCircle } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface InstructorProfileProps {
  instructor: any;
}

export function InstructorProfile({ instructor }: InstructorProfileProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Instructor</h2>
      
      <div className="border border-border/60 rounded-xl p-6 bg-card">
        <div className="flex flex-col sm:flex-row gap-6 mb-6">
          <Avatar className="w-24 h-24 border-2 border-background shadow-md">
            <AvatarImage src={instructor.avatarUrl} alt={instructor.name} />
            <AvatarFallback>{instructor.name.charAt(0)}</AvatarFallback>
          </Avatar>
          
          <div className="space-y-3">
            <div>
              <h3 className="text-xl font-bold">{instructor.name}</h3>
              <p className="text-muted-foreground">{instructor.headline}</p>
            </div>
            
            <div className="flex flex-wrap items-center gap-4 text-sm font-medium">
              <div className="flex items-center gap-1.5 text-amber-600">
                <Star className="w-4 h-4 fill-current" /> {instructor.rating} Rating
              </div>
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Award className="w-4 h-4" /> {instructor.reviews.toLocaleString()} Reviews
              </div>
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Users className="w-4 h-4" /> {instructor.students.toLocaleString()} Students
              </div>
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <PlayCircle className="w-4 h-4" /> {instructor.courses} Courses
              </div>
            </div>
          </div>
        </div>
        
        <div className="prose prose-sm prose-slate dark:prose-invert max-w-none text-muted-foreground">
          <p className="whitespace-pre-wrap">{instructor.bio}</p>
        </div>
      </div>
    </div>
  );
}

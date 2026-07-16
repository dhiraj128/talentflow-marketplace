"use client";
import { PageHeader } from "@/components/shared/PageHeader"
import { CourseCard } from "@/components/shared/CourseCard"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { useEffect, useState } from "react"
import { courseService } from "@/lib/services/course.service"
import { useAuth } from "@/lib/auth-context"

export default function CoursesPage() {
  const { user } = useAuth();
  const [courses, setCourses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      const trainerId = (user as any)?.profile?.id;
      if (!trainerId) {
        setIsLoading(false);
        return;
      }
      try {
        const data = await courseService.getCourses({ trainerId });
        setCourses(data);
      } catch (error) {
        console.error("Failed to fetch courses", error);
      } finally {
        setIsLoading(false);
      }
    };
    if (user) fetchCourses();
  }, [user]);


  return (
    <>
      <PageHeader 
        title="My Courses" 
        description="Manage your published courses and create new ones." 
        action={<Button><Plus className="h-4 w-4 mr-2" /> Create Course</Button>}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mt-8">
        {isLoading ? (
          <div className="col-span-full text-center text-muted-foreground py-12">Loading courses...</div>
        ) : courses.length === 0 ? (
          <div className="col-span-full text-center text-muted-foreground py-12">No courses found.</div>
        ) : courses.map((course, idx) => (
          <CourseCard 
            key={course.id || idx} 
            title={course.title}
            instructor={course.trainer?.fullName || "Trainer"}
            rating={course.rating || 0}
            enrolled={course.studentCount || 0}
            duration={"TBA"}
            price={"Free"}
            image={course.thumbnailUrl || "https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=600&auto=format&fit=crop"}
          />
        ))}
      </div>
    </>
  )
}

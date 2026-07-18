"use client";
import { PageHeader } from "@/components/shared/PageHeader"
import { CourseCard } from "@/components/shared/CourseCard"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { useEffect, useState } from "react"
import { courseService } from "@/lib/services/course.service"
import { useAuth } from "@/lib/auth-context"
import { Badge } from "@/components/ui/badge"
import api from "@/lib/api"
import { toast } from "sonner"

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

  const handleSubmit = async (courseId: string) => {
    try {
      await api.patch(`/courses/${courseId}/submit`);
      toast.success("Course submitted for approval");
      setCourses(courses.map(c => c.id === courseId ? { ...c, status: 'PENDING' } : c));
    } catch (e: any) {
      toast.error(e.response?.data?.message || "Failed to submit course");
    }
  };


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
          <div key={course.id || idx} className="relative group">
            <CourseCard 
              title={course.title}
              instructor={course.trainer?.fullName || "Trainer"}
              rating={course.rating || 0}
              enrolled={course.studentCount || 0}
              duration={"TBA"}
              price={"Free"}
              image={course.thumbnailUrl || "https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=600&auto=format&fit=crop"}
            />
            <div className="absolute top-4 right-4 flex gap-2">
              <Badge variant={course.status === 'PUBLISHED' ? 'default' : course.status === 'PENDING' ? 'secondary' : 'outline'}>
                {course.status}
              </Badge>
            </div>
            {course.status === 'DRAFT' && (
              <div className="mt-2">
                <Button onClick={() => handleSubmit(course.id)} className="w-full" variant="outline">
                  Submit for Approval
                </Button>
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  )
}

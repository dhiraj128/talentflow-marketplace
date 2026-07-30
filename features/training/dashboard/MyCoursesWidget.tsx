import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { PlayCircle, CheckCircle2, BookOpen } from "lucide-react";
import Link from "next/link";
import { CourseLevelBadge } from "../shared/CourseLevelBadge";
import { EmptyState } from "@/components/shared/EmptyState";
import api from "@/lib/api";

export function MyCoursesWidget() {
  const [courses, setCourses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchEnrollments();
  }, []);

  const fetchEnrollments = async () => {
    setIsLoading(true);
    try {
      const res = await api.get('/enrollments').catch(() => null);
      const list = Array.isArray(res?.data) ? res.data : res?.data?.data || [];
      const formatted = list.map((e: any) => ({
        id: e.course?.id || e.courseId || e.id,
        title: e.course?.title || "Enrolled Course",
        instructor: e.course?.trainer?.companyName || e.course?.trainer?.user?.fullName || "Trainer",
        progress: e.progress || 0,
        totalModules: 10,
        completedModules: Math.round(((e.progress || 0) / 100) * 10),
        thumbnail: e.course?.thumbnailUrl || "https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=600&auto=format&fit=crop",
        level: "Certificate",
      }));
      setCourses(formatted);
    } catch (e) {
      console.warn("Failed to load enrolled courses", e);
      setCourses([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="flex flex-col h-full border-muted/60">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <CardTitle className="text-xl font-bold">My Courses</CardTitle>
        <Link href="/find-courses" className="text-sm text-blue-600 hover:text-blue-800 font-medium">
          Browse All
        </Link>
      </CardHeader>
      <CardContent className="flex-1 p-0">
        {isLoading ? (
          <div className="p-6 text-center text-muted-foreground">Loading courses...</div>
        ) : courses.length > 0 ? (
          <div className="divide-y divide-border/40">
            {courses.map((course) => (
              <div key={course.id} className="p-6 hover:bg-muted/30 transition-colors group">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="relative w-full sm:w-40 h-24 shrink-0 rounded-md overflow-hidden bg-muted">
                    <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                    {course.progress === 100 && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center backdrop-blur-[2px]">
                        <CheckCircle2 className="w-10 h-10 text-white" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1.5">
                        <CourseLevelBadge level={course.level as any} className="scale-90 origin-left" />
                        <span className="text-xs text-muted-foreground">{course.instructor}</span>
                      </div>
                      <h3 className="font-bold text-base leading-tight line-clamp-1">{course.title}</h3>
                    </div>

                    <div className="mt-4 sm:mt-0">
                      <div className="flex justify-between text-xs font-medium mb-1.5">
                        <span className={course.progress === 100 ? "text-green-600" : "text-muted-foreground"}>
                          {course.progress === 100 ? "Completed" : `${course.progress}% Progress`}
                        </span>
                        <span>{course.progress}%</span>
                      </div>
                      <Progress value={course.progress} className={`h-1.5 ${course.progress === 100 ? "[&>div]:bg-green-500" : "[&>div]:bg-blue-600"}`} />
                    </div>
                  </div>

                  <div className="sm:ml-2 flex items-center shrink-0">
                    <Link href={`/job-seeker/learning/${course.id}`}>
                      <Button variant={course.progress === 100 ? "outline" : "default"} className={course.progress === 100 ? "" : "bg-blue-600 hover:bg-blue-700"} size="sm">
                        {course.progress === 100 ? "Review" : <><PlayCircle className="w-4 h-4 mr-1.5" /> Resume</>}
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6">
            <EmptyState
              icon={<BookOpen className="h-8 w-8 text-muted-foreground" />}
              title="No enrolled courses"
              description="Explore available courses to start learning."
              action={{ label: "Explore Courses", href: "/find-courses" }}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}

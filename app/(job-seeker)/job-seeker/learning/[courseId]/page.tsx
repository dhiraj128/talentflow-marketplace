"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import api from "@/lib/api";
import { PageContainer } from "@/components/shared/PageContainer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, PlayCircle, Award } from "lucide-react";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

export default function LearningInterfacePage() {
  const { courseId } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  
  const [course, setCourse] = useState<any>(null);
  const [progress, setProgress] = useState<any[]>([]);
  const [enrollment, setEnrollment] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchLearningData = async () => {
    try {
      const response = await api.get('/courses/my-learning');
      const enrolls = response.data;
      const currentEnrollment = enrolls.find((e: any) => e.courseId === courseId);
      if (!currentEnrollment) {
        toast.error("You are not enrolled in this course");
        router.push(`/find-courses/${courseId}`);
        return;
      }
      setEnrollment(currentEnrollment);
      setCourse(currentEnrollment.course);
      setProgress(currentEnrollment.lessonProgress || []);
    } catch (error) {
      toast.error("Failed to load learning data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === 'job-seeker') {
      fetchLearningData();
    } else if (user) {
      router.push('/');
    }
  }, [user, courseId]);

  const markLessonComplete = async (lessonId: string) => {
    try {
      await api.post(`/progress/lesson/${lessonId}`);
      toast.success("Lesson marked as complete");
      fetchLearningData();
    } catch (error) {
      toast.error("Failed to update progress");
    }
  };

  if (isLoading) {
    return (
      <PageContainer>
        <Skeleton className="w-full h-12 mb-8" />
        <Skeleton className="w-full h-64 rounded-xl" />
      </PageContainer>
    );
  }

  if (!course) return null;

  const isCompleted = (lessonId: string) => progress.some((p: any) => p.lessonId === lessonId && p.isCompleted);
  const courseCompleted = enrollment.progress === 100;

  return (
    <PageContainer>
      <div className="flex flex-col gap-8 max-w-4xl mx-auto">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-4">{course.title}</h1>
          <div className="flex items-center gap-4">
            <div className="flex-1 h-3 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-primary transition-all duration-500" style={{ width: `${enrollment.progress}%` }}></div>
            </div>
            <span className="font-bold text-primary">{enrollment.progress}% Completed</span>
          </div>
        </div>

        {courseCompleted && (
          <Card className="bg-primary/10 border-primary/20">
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-lg mb-1 flex items-center gap-2">
                  <Award className="text-primary" /> Course Completed!
                </h3>
                <p className="text-muted-foreground text-sm">You have finished all lessons. Take the assessment to earn your certificate.</p>
              </div>
              <Button onClick={() => router.push(`/job-seeker/learning/${course.id}/assessment`)}>
                Take Assessment
              </Button>
            </CardContent>
          </Card>
        )}

        <div className="space-y-6">
          {course.modules?.map((module: any, idx: number) => (
            <Card key={module.id} className="overflow-hidden">
              <div className="bg-muted p-4 font-bold text-lg border-b">
                Module {idx + 1}: {module.title}
              </div>
              <CardContent className="p-0">
                {module.lessons?.map((lesson: any) => {
                  const completed = isCompleted(lesson.id);
                  return (
                    <div key={lesson.id} className="flex items-center justify-between p-4 border-b last:border-b-0 hover:bg-muted/30">
                      <div className="flex items-center gap-4">
                        {completed ? (
                          <CheckCircle className="w-6 h-6 text-green-500" />
                        ) : (
                          <PlayCircle className="w-6 h-6 text-muted-foreground" />
                        )}
                        <span className={`font-medium ${completed ? 'text-muted-foreground line-through' : 'text-foreground'}`}>
                          {lesson.title}
                        </span>
                      </div>
                      {!completed && (
                        <Button size="sm" variant="outline" onClick={() => markLessonComplete(lesson.id)}>
                          Mark Complete
                        </Button>
                      )}
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </PageContainer>
  );
}

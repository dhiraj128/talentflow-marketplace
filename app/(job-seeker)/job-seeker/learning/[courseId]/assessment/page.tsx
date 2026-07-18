"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import api from "@/lib/api";
import { PageContainer } from "@/components/shared/PageContainer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

export default function AssessmentPage() {
  const { courseId } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  
  const [course, setCourse] = useState<any>(null);
  const [assessment, setAssessment] = useState<any>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    const fetchAssessmentData = async () => {
      try {
        const response = await api.get('/courses/my-learning');
        const currentEnrollment = response.data.find((e: any) => e.courseId === courseId);
        
        if (!currentEnrollment) {
          toast.error("Not enrolled");
          router.push(`/find-courses/${courseId}`);
          return;
        }

        if (currentEnrollment.progress < 100) {
          toast.error("You must complete all lessons before taking the assessment");
          router.push(`/job-seeker/learning/${courseId}`);
          return;
        }

        setCourse(currentEnrollment.course);
        setAssessment(currentEnrollment.course.assessment);
      } catch (error) {
        toast.error("Failed to load assessment");
      } finally {
        setIsLoading(false);
      }
    };

    if (user?.role === 'job-seeker') {
      fetchAssessmentData();
    }
  }, [user, courseId]);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const response = await api.post(`/assessments/${courseId}/submit`, { answers });
      setResult(response.data);
      if (response.data.passed) {
        toast.success("Assessment passed! Certificate generated.");
      } else {
        toast.error("Assessment failed. Try again.");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Submission failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <PageContainer>
        <Skeleton className="w-full h-12 mb-8" />
        <Skeleton className="w-full h-96 rounded-xl" />
      </PageContainer>
    );
  }

  if (!assessment || !assessment.questions || assessment.questions.length === 0) {
    return (
      <PageContainer>
        <div className="text-center py-20 text-muted-foreground text-xl">
          Assessment not available for this course yet.
        </div>
      </PageContainer>
    );
  }

  if (result) {
    return (
      <PageContainer>
        <Card className="max-w-2xl mx-auto mt-10">
          <CardContent className="p-10 flex flex-col items-center text-center">
            <h2 className="text-3xl font-bold mb-4">{result.passed ? 'Congratulations!' : 'Keep Learning'}</h2>
            <p className="text-xl mb-8">You scored <strong className="text-primary">{result.score}%</strong></p>
            {result.passed ? (
              <Button onClick={() => router.push('/job-seeker/profile')}>View Certificate in Profile</Button>
            ) : (
              <Button variant="outline" onClick={() => setResult(null)}>Retake Assessment</Button>
            )}
          </CardContent>
        </Card>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">{assessment.title || 'Course Assessment'}</h1>
        <p className="text-muted-foreground mb-8">Passing score: {assessment.passingScore}%</p>

        <div className="space-y-8 mb-8">
          {assessment.questions.map((q: any, idx: number) => (
            <Card key={q.id}>
              <CardContent className="p-6">
                <h3 className="font-bold text-lg mb-4">{idx + 1}. {q.text}</h3>
                <RadioGroup 
                  onValueChange={(val) => setAnswers(prev => ({ ...prev, [q.id]: val }))}
                  value={answers[q.id] || ''}
                >
                  {(q.options as any[]).map((opt: any, oIdx: number) => (
                    <div className="flex items-center space-x-3 mb-3" key={oIdx}>
                      <RadioGroupItem value={opt.text} id={`${q.id}-${oIdx}`} />
                      <Label htmlFor={`${q.id}-${oIdx}`} className="text-base font-normal cursor-pointer">
                        {opt.text}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </CardContent>
            </Card>
          ))}
        </div>

        <Button 
          size="lg" 
          className="w-full text-lg" 
          onClick={handleSubmit} 
          disabled={isSubmitting || Object.keys(answers).length !== assessment.questions.length}
        >
          {isSubmitting ? 'Grading...' : 'Submit Assessment'}
        </Button>
      </div>
    </PageContainer>
  );
}

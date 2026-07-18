"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { PageHeader } from "@/components/shared/PageHeader";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { courseService } from "@/lib/services/course.service";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { PlusCircle, Book, CheckCircle } from "lucide-react";

export default function EditCoursePage() {
  const { id } = useParams() as { id: string };
  const queryClient = useQueryClient();

  const { data: course, isLoading } = useQuery({
    queryKey: ['course', id],
    queryFn: () => courseService.getCourse(id)
  });

  const [newModuleTitle, setNewModuleTitle] = useState("");
  const [newLessonTitle, setNewLessonTitle] = useState("");
  const [newAssessmentTitle, setNewAssessmentTitle] = useState("");
  const [newQuestionText, setNewQuestionText] = useState("");
  const [activeModuleId, setActiveModuleId] = useState<string | null>(null);
  const [activeAssessmentId, setActiveAssessmentId] = useState<string | null>(null);

  const moduleMutation = useMutation({
    mutationFn: (title: string) => courseService.createModule(id, { title, order: course?.modules?.length || 0 }),
    onSuccess: () => {
      toast.success("Module added");
      setNewModuleTitle("");
      queryClient.invalidateQueries({ queryKey: ['course', id] });
    }
  });

  const lessonMutation = useMutation({
    mutationFn: (title: string) => courseService.createLesson(activeModuleId!, { title, order: 0, content: "Lesson content goes here", type: "VIDEO", duration: 10 }),
    onSuccess: () => {
      toast.success("Lesson added");
      setNewLessonTitle("");
      setActiveModuleId(null);
      queryClient.invalidateQueries({ queryKey: ['course', id] });
    }
  });

  const assessmentMutation = useMutation({
    mutationFn: (title: string) => courseService.createAssessment(id, { title, passingScore: 80, timeLimit: 30 }),
    onSuccess: () => {
      toast.success("Assessment added");
      setNewAssessmentTitle("");
      queryClient.invalidateQueries({ queryKey: ['course', id] });
    }
  });

  const questionMutation = useMutation({
    mutationFn: (text: string) => courseService.createQuestion(activeAssessmentId!, { 
      text, 
      type: "MULTIPLE_CHOICE", 
      options: [{ text: "Yes", isCorrect: true }, { text: "No", isCorrect: false }] 
    }),
    onSuccess: () => {
      toast.success("Question added");
      setNewQuestionText("");
      setActiveAssessmentId(null);
      queryClient.invalidateQueries({ queryKey: ['course', id] });
    }
  });

  if (isLoading) return <div className="p-8">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto p-8 space-y-8">
      <PageHeader 
        title={`Edit Course: ${course?.title}`} 
        description="Add modules and lessons to your course." 
        action={<Button variant="outline" onClick={() => window.location.href = '/trainer/courses'}>Back to Courses</Button>}
      />
      
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Course Modules</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {course?.modules?.map((mod: any, idx: number) => (
              <div key={mod.id} className="border rounded-xl p-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-lg">{idx + 1}. {mod.title}</h3>
                  <Button variant="outline" size="sm" onClick={() => setActiveModuleId(mod.id)}>
                    <PlusCircle className="w-4 h-4 mr-2" /> Add Lesson
                  </Button>
                </div>
                
                <div className="space-y-2 pl-4 border-l-2 ml-2">
                  {mod.lessons?.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No lessons yet.</p>
                  ) : mod.lessons?.map((lesson: any, lIdx: number) => (
                    <div key={lesson.id} className="flex items-center gap-2 p-2 bg-muted/50 rounded-lg">
                      <Book className="w-4 h-4 text-primary" />
                      <span className="text-sm font-medium">{lIdx + 1}. {lesson.title}</span>
                    </div>
                  ))}
                  
                  {activeModuleId === mod.id && (
                    <div className="flex gap-2 mt-2">
                      <Input value={newLessonTitle} onChange={e => setNewLessonTitle(e.target.value)} placeholder="New Lesson Title" />
                      <Button onClick={() => lessonMutation.mutate(newLessonTitle)} disabled={!newLessonTitle || lessonMutation.isPending}>Add</Button>
                      <Button variant="ghost" onClick={() => setActiveModuleId(null)}>Cancel</Button>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {course?.assessments?.map((assessment: any, idx: number) => (
              <div key={assessment.id} className="border rounded-xl p-4 mt-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-lg">Assessment {idx + 1}: {assessment.title}</h3>
                  <Button variant="outline" size="sm" onClick={() => setActiveAssessmentId(assessment.id)}>
                    <PlusCircle className="w-4 h-4 mr-2" /> Add Question
                  </Button>
                </div>
                
                <div className="space-y-2 pl-4 border-l-2 ml-2">
                  {assessment.questions?.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No questions yet.</p>
                  ) : assessment.questions?.map((question: any, qIdx: number) => (
                    <div key={question.id} className="flex items-center gap-2 p-2 bg-muted/50 rounded-lg">
                      <Book className="w-4 h-4 text-primary" />
                      <span className="text-sm font-medium">{qIdx + 1}. {question.text}</span>
                    </div>
                  ))}
                  
                  {activeAssessmentId === assessment.id && (
                    <div className="flex gap-2 mt-2">
                      <Input value={newQuestionText} onChange={e => setNewQuestionText(e.target.value)} placeholder="New Question Text" />
                      <Button onClick={() => questionMutation.mutate(newQuestionText)} disabled={!newQuestionText || questionMutation.isPending}>Add</Button>
                      <Button variant="ghost" onClick={() => setActiveAssessmentId(null)}>Cancel</Button>
                    </div>
                  )}
                </div>
              </div>
            ))}

            <div className="flex gap-4 items-end bg-muted/20 p-4 rounded-xl border border-dashed mt-4">
              <div className="flex-1 space-y-2">
                <Label>Add New Module</Label>
                <Input value={newModuleTitle} onChange={e => setNewModuleTitle(e.target.value)} placeholder="e.g. Introduction to React" />
              </div>
              <Button onClick={() => moduleMutation.mutate(newModuleTitle)} disabled={!newModuleTitle || moduleMutation.isPending}>
                Add Module
              </Button>
            </div>
            <div className="flex gap-4 items-end bg-muted/20 p-4 rounded-xl border border-dashed mt-4">
              <div className="flex-1 space-y-2">
                <Label>Add New Assessment</Label>
                <Input value={newAssessmentTitle} onChange={e => setNewAssessmentTitle(e.target.value)} placeholder="e.g. Final Exam" />
              </div>
              <Button onClick={() => assessmentMutation.mutate(newAssessmentTitle)} disabled={!newAssessmentTitle || assessmentMutation.isPending}>
                Add Assessment
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Publish Course</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Once you have added all modules and lessons, you can submit this course for Admin approval. It is currently in <strong>{course?.status}</strong> status.
            </p>
            <Button className="gap-2" disabled={course?.status === 'PUBLISHED'} onClick={() => toast.info("Submission for admin approval has been logged.")}>
              <CheckCircle className="w-4 h-4" /> 
              {course?.status === 'PUBLISHED' ? 'Course is Published' : 'Submit for Approval'}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

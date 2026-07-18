"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/shared/PageHeader";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { courseService } from "@/lib/services/course.service";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function CreateCoursePage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    price: 0,
    level: "Beginner",
    duration: "4 weeks"
  });

  const mutation = useMutation({
    mutationFn: (data: any) => courseService.createCourse(data),
    onSuccess: (data) => {
      toast.success("Course created! Add modules now.");
      router.push(`/trainer/courses/${data.id}/edit`);
    },
    onError: (err: any) => toast.error(err?.response?.data?.message || "Failed to create course")
  });

  return (
    <div className="max-w-4xl mx-auto p-8">
      <PageHeader title="Create New Course" description="Provide basic information about your course." action={<Button variant="outline" onClick={() => window.location.href = '/trainer/courses'}>Cancel</Button>} />
      
      <Card className="mt-8">
        <CardContent className="p-6 space-y-6">
          <div className="space-y-2">
            <Label>Course Title</Label>
            <Input value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} placeholder="e.g. Advanced React Patterns" />
          </div>
          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} placeholder="What will students learn?" rows={4} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Category</Label>
              <Input value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} placeholder="e.g. Development" />
            </div>
            <div className="space-y-2">
              <Label>Level</Label>
              <Select value={formData.level} onValueChange={v => setFormData({ ...formData, level: v || "" })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Beginner">Beginner</SelectItem>
                  <SelectItem value="Intermediate">Intermediate</SelectItem>
                  <SelectItem value="Advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Duration</Label>
              <Input value={formData.duration} onChange={e => setFormData({ ...formData, duration: e.target.value })} placeholder="e.g. 4 weeks" />
            </div>
            <div className="space-y-2">
              <Label>Price ($)</Label>
              <Input type="number" value={formData.price} onChange={e => setFormData({ ...formData, price: parseFloat(e.target.value) })} />
            </div>
          </div>
          
          <div className="flex justify-end pt-4">
            <Button onClick={() => mutation.mutate(formData)} disabled={mutation.isPending || !formData.title}>
              {mutation.isPending ? "Saving..." : "Save & Continue"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

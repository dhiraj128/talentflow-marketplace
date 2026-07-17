"use client";
import React, { useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";
import { jobService } from "@/lib/services/job.service";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function PostJobPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    location: "",
    type: "",
    salaryRange: "",
    description: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const employerId = (user as any)?.profile?.id;
    if (!employerId) {
      toast.error("Error", { description: "You must complete your employer profile first." });
      return;
    }
    setIsSubmitting(true);
    try {
      await jobService.createJob(formData);
      toast.success("Success", { description: "Job created and pending Admin approval" });
      router.push("/employer/dashboard");
    } catch (err) {
      toast.error("Error", { description: "Failed to publish job." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-8 space-y-8">
      <PageHeader title="Post a New Job" description="Create a new job listing to find top talent." />
      <Card>
        <CardContent className="pt-6">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="title">Job Title</Label>
                <Input id="title" value={formData.title} onChange={handleChange} placeholder="e.g. Software Engineer" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input id="location" value={formData.location} onChange={handleChange} placeholder="e.g. Remote, New York, etc." />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Employment Type</Label>
                <Input id="type" value={formData.type} onChange={handleChange} placeholder="e.g. Full-time, Contract" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="salaryRange">Salary Range</Label>
                <Input id="salaryRange" value={formData.salaryRange} onChange={handleChange} placeholder="e.g. $80k - $100k" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Job Description</Label>
              <Textarea id="description" value={formData.description} onChange={handleChange} placeholder="Describe the role and requirements" rows={6} required />
            </div>
            <div className="flex justify-end gap-4">
              <Button variant="outline" type="button" onClick={() => router.back()}>Cancel</Button>
              <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Publishing..." : "Publish Job"}</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

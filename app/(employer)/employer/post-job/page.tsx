"use client";

import React, { useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { PageContainer } from "@/components/shared/PageContainer";
import { useAuth } from "@/lib/auth-context";
import { jobService } from "@/lib/services/job.service";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { PostJobWizard, JobFormData } from "@/features/employer/post-job/PostJobWizard";
import { JobSuccessDialog } from "@/features/employer/post-job/JobSuccessDialog";

export default function PostJobPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = async (formData: JobFormData) => {
    const employerId = (user as any)?.profile?.id;
    if (!employerId) {
      toast.error("Error", { description: "You must complete your employer profile first." });
      return;
    }
    
    setIsSubmitting(true);
    try {
      // The backend createJob expects specific fields, so we map the frontend wizard fields here.
      // Make sure the backend `jobService.createJob` supports these or mapping correctly.
      await jobService.createJob({
        title: formData.title,
        location: formData.location,
        type: formData.type,
        salaryRange: formData.salaryRange,
        description: formData.description + (formData.requirements ? "\n\nRequirements:\n" + formData.requirements : ""),
        // if API supports these:
        // experience: formData.experience,
        // skills: formData.skills,
      });
      setShowSuccess(true);
    } catch (err) {
      toast.error("Error", { description: "Failed to publish job." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageContainer>
      <div className="max-w-4xl mx-auto space-y-8 pb-12">
        <PageHeader 
          title="Post a New Job" 
          description="Create a new job listing to find top talent using our AI matching engine." 
        />
        
        <PostJobWizard 
          onSubmit={handleSubmit} 
          onCancel={() => router.back()} 
          isSubmitting={isSubmitting} 
        />

        <JobSuccessDialog 
          open={showSuccess} 
          onOpenChange={(open) => !open && setShowSuccess(false)} 
        />
      </div>
    </PageContainer>
  );
}

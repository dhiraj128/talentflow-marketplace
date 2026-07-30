"use client";

import React, { useState } from "react";
import { PageContainer } from "@/components/shared/PageContainer";
import { ServiceWizard, ServiceFormData } from "@/features/freelancer/services/ServiceWizard";
import { PublishSuccessDialog } from "@/features/freelancer/services/PublishSuccessDialog";
import { useRouter } from "next/navigation";
import { freelancerService } from "@/lib/services/freelancer.service";
import { toast } from "sonner";

export default function NewServicePage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = async (data: ServiceFormData) => {
    setIsSubmitting(true);
    try {
      await freelancerService.updateMyProfile({
        title: data.title || "Freelance Service",
        category: data.category,
        hourlyRate: parseFloat(data.hourlyRate || "0") || 0,
        skills: data.skills || [],
        bio: data.description
      });
      setShowSuccess(true);
    } catch (error: any) {
      console.error("Failed to submit service:", error);
      toast.error(error?.response?.data?.message || "Failed to create service profile");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.push("/freelancer/dashboard");
  };

  return (
    <PageContainer>
      <div className="max-w-4xl mx-auto space-y-6 pb-20">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Create a New Service</h1>
          <p className="text-muted-foreground text-lg">Define your offering, set your price, and get hired by top clients.</p>
        </div>
        
        <ServiceWizard 
          onSubmit={handleSubmit} 
          onCancel={handleCancel} 
          isSubmitting={isSubmitting} 
        />

        <PublishSuccessDialog open={showSuccess} onOpenChange={setShowSuccess} />
      </div>
    </PageContainer>
  );
}

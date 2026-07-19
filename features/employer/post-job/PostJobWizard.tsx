import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";

import { BasicDetailsStep } from "./BasicDetailsStep";
import { HiringTypeStep } from "./HiringTypeStep";
import { CompensationStep } from "./CompensationStep";
import { SkillsStep } from "./SkillsStep";
import { DescriptionStep } from "./DescriptionStep";
import { PreviewStep } from "./PreviewStep";

export interface JobFormData {
  title: string;
  location: string;
  type: string;
  salaryRange: string;
  experience: string;
  skills: string[];
  description: string;
  requirements: string;
}

interface PostJobWizardProps {
  onSubmit: (data: JobFormData) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
}

const STEPS = [
  "Basic Details",
  "Hiring Type",
  "Compensation",
  "Skills & Reqs",
  "Description",
  "Preview"
];

export function PostJobWizard({ onSubmit, onCancel, isSubmitting }: PostJobWizardProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<JobFormData>({
    title: "",
    location: "",
    type: "",
    salaryRange: "",
    experience: "",
    skills: [],
    description: "",
    requirements: ""
  });

  const updateData = (data: Partial<JobFormData>) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    } else {
      onCancel();
    }
  };

  const handleSubmit = async () => {
    await onSubmit(formData);
  };

  const progress = ((currentStep + 1) / STEPS.length) * 100;

  return (
    <div className="space-y-6">
      {/* Progress Header */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="font-medium text-muted-foreground">Step {currentStep + 1} of {STEPS.length}: {STEPS[currentStep]}</span>
          <span className="text-muted-foreground">{Math.round(progress)}% Completed</span>
        </div>
        <Progress value={progress} className="h-2" />
        
        {/* Desktop Stepper */}
        <div className="hidden md:flex justify-between pt-4">
          {STEPS.map((step, idx) => (
            <div key={step} className={`text-xs flex flex-col items-center gap-2 ${idx <= currentStep ? "text-primary font-medium" : "text-muted-foreground"}`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center border-2 ${idx < currentStep ? "bg-primary border-primary text-primary-foreground" : idx === currentStep ? "border-primary" : "border-muted"}`}>
                {idx < currentStep ? <Check className="w-3 h-3" /> : idx + 1}
              </div>
              {step}
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <Card className="min-h-[400px] border-primary/10 shadow-sm">
        <CardContent className="p-6 md:p-10 flex flex-col h-full">
          <div className="flex-1">
            {currentStep === 0 && <BasicDetailsStep data={formData} updateData={updateData} />}
            {currentStep === 1 && <HiringTypeStep data={formData} updateData={updateData} />}
            {currentStep === 2 && <CompensationStep data={formData} updateData={updateData} />}
            {currentStep === 3 && <SkillsStep data={formData} updateData={updateData} />}
            {currentStep === 4 && <DescriptionStep data={formData} updateData={updateData} />}
            {currentStep === 5 && <PreviewStep data={formData} />}
          </div>
          
          <div className="pt-8 mt-auto border-t flex justify-between gap-4">
            <Button variant="outline" onClick={handleBack} disabled={isSubmitting}>
              {currentStep === 0 ? "Cancel" : <><ArrowLeft className="w-4 h-4 mr-2" /> Back</>}
            </Button>
            
            {currentStep === STEPS.length - 1 ? (
              <Button onClick={handleSubmit} disabled={isSubmitting}>
                {isSubmitting ? "Publishing..." : "Submit for Approval"}
              </Button>
            ) : (
              <Button onClick={handleNext}>
                Next <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <p className="text-center text-xs text-muted-foreground mt-4">
        Job will go live after Admin review (typically 2–4 hours).
      </p>
    </div>
  );
}

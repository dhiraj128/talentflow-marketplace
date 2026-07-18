import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";

import { BasicInfoStep } from "./BasicInfoStep";
import { SkillsStep } from "./SkillsStep";
import { PricingStep } from "./PricingStep";
import { PortfolioStep } from "./PortfolioStep";
import { AvailabilityStep } from "./AvailabilityStep";
import { PreviewStep } from "./PreviewStep";

export interface ServiceFormData {
  title: string;
  category: string;
  description: string;
  skills: string[];
  hourlyRate: string;
  projectMin: string;
  portfolioLinks: string[];
  availability: string;
}

interface ServiceWizardProps {
  onSubmit: (data: ServiceFormData) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
}

const STEPS = [
  "Basic Info",
  "Skills",
  "Pricing",
  "Portfolio",
  "Availability",
  "Preview"
];

export function ServiceWizard({ onSubmit, onCancel, isSubmitting }: ServiceWizardProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<ServiceFormData>({
    title: "",
    category: "",
    description: "",
    skills: [],
    hourlyRate: "",
    projectMin: "",
    portfolioLinks: [],
    availability: ""
  });

  const updateData = (data: Partial<ServiceFormData>) => {
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
            <div key={step} className={`text-xs flex flex-col items-center gap-2 ${idx <= currentStep ? "text-purple-600 font-medium" : "text-muted-foreground"}`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center border-2 ${idx < currentStep ? "bg-purple-600 border-purple-600 text-white" : idx === currentStep ? "border-purple-600" : "border-muted"}`}>
                {idx < currentStep ? <Check className="w-3 h-3" /> : idx + 1}
              </div>
              {step}
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <Card className="min-h-[400px] border-purple-500/10 shadow-sm">
        <CardContent className="p-6 md:p-10 flex flex-col h-full">
          <div className="flex-1">
            {currentStep === 0 && <BasicInfoStep data={formData} updateData={updateData} />}
            {currentStep === 1 && <SkillsStep data={formData} updateData={updateData} />}
            {currentStep === 2 && <PricingStep data={formData} updateData={updateData} />}
            {currentStep === 3 && <PortfolioStep data={formData} updateData={updateData} />}
            {currentStep === 4 && <AvailabilityStep data={formData} updateData={updateData} />}
            {currentStep === 5 && <PreviewStep data={formData} />}
          </div>
          
          <div className="pt-8 mt-auto border-t flex justify-between gap-4">
            <Button variant="outline" onClick={handleBack} disabled={isSubmitting}>
              {currentStep === 0 ? "Cancel" : <><ArrowLeft className="w-4 h-4 mr-2" /> Back</>}
            </Button>
            
            {currentStep === STEPS.length - 1 ? (
              <Button onClick={handleSubmit} disabled={isSubmitting} className="bg-purple-600 hover:bg-purple-700 text-white">
                {isSubmitting ? "Publishing..." : "Publish Service"}
              </Button>
            ) : (
              <Button onClick={handleNext} className="bg-purple-600 hover:bg-purple-700 text-white">
                Next <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <p className="text-center text-xs text-muted-foreground">
        Autosaved locally • Your service will be reviewed before appearing in the marketplace.
      </p>
    </div>
  );
}

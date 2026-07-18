"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface EnrollButtonProps {
  courseId: string;
  price?: number;
  isEnrolled?: boolean;
  className?: string;
  onEnroll?: () => void;
}

export function EnrollButton({ courseId, price, isEnrolled, className, onEnroll }: EnrollButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleEnroll = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      if (onEnroll) onEnroll();
    }, 1500);
  };

  if (isEnrolled) {
    return (
      <Button variant="outline" className={cn("w-full gap-2", className)}>
        Continue Learning <ArrowRight className="w-4 h-4" />
      </Button>
    );
  }

  return (
    <Button 
      onClick={handleEnroll} 
      disabled={isLoading}
      className={cn("w-full bg-blue-600 hover:bg-blue-700 text-white font-medium", className)}
    >
      {isLoading ? (
        <>
          <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Enrolling...
        </>
      ) : (
        price && price > 0 ? `Enroll for $${price}` : "Enroll for Free"
      )}
    </Button>
  );
}

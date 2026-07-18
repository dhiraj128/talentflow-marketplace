import React from "react";
import { Button } from "@/components/ui/button";
import { Zap } from "lucide-react";
import { cn } from "@/lib/utils";

interface HireButtonProps {
  onClick?: () => void;
  className?: string;
  size?: "default" | "sm" | "lg" | "icon";
  variant?: "default" | "secondary" | "outline";
  text?: string;
}

export function HireButton({ onClick, className, size = "default", variant = "default", text = "Hire Freelancer" }: HireButtonProps) {
  return (
    <Button 
      onClick={onClick} 
      size={size} 
      variant={variant}
      className={cn("bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-md transition-all hover:shadow-lg", className)}
    >
      <Zap className={cn("w-4 h-4", text ? "mr-2" : "")} />
      {text && text}
    </Button>
  );
}

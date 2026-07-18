"use client";

import React from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export interface PricingPlanFeature {
  name: string;
  included: boolean;
  tooltip?: string;
}

export interface PricingPlanProps {
  id: string;
  name: string;
  price: number;
  description: string;
  features: PricingPlanFeature[];
  isPopular?: boolean;
  onSelect?: () => void;
  disabled?: boolean;
  buttonText?: string;
}

export function PricingPlanCard({
  name,
  price,
  description,
  features,
  isPopular,
  onSelect,
  disabled = false,
  buttonText = "Select Plan"
}: PricingPlanProps) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 300 }}
      className="h-full"
    >
      <Card className={cn(
        "relative flex flex-col h-full overflow-hidden transition-all duration-300",
        isPopular ? "border-primary shadow-lg shadow-primary/10" : "border-border/50",
        "bg-white/50 dark:bg-zinc-900/50 backdrop-blur-xl"
      )}>
        {isPopular && (
          <div className="absolute top-0 right-0 left-0 bg-primary text-primary-foreground text-center py-1 text-xs font-semibold uppercase tracking-wider">
            Most Popular
          </div>
        )}
        
        <CardHeader className={cn("pt-8", isPopular ? "pt-10" : "")}>
          <CardTitle className="text-xl font-bold">{name}</CardTitle>
          <CardDescription className="min-h-[40px]">{description}</CardDescription>
          <div className="mt-4 flex items-baseline text-4xl font-extrabold">
            ₹{price}
            <span className="ml-1 text-xl font-medium text-muted-foreground">/one-time</span>
          </div>
        </CardHeader>
        
        <CardContent className="flex-1">
          <ul className="space-y-3 mt-4">
            {features.map((feature, i) => (
              <li key={i} className="flex items-start gap-2">
                <Check className={cn(
                  "h-5 w-5 shrink-0", 
                  feature.included ? "text-primary" : "text-muted opacity-50"
                )} />
                <span className={cn(
                  "text-sm",
                  feature.included ? "text-foreground" : "text-muted-foreground opacity-70 line-through"
                )}>
                  {feature.name}
                </span>
                {feature.tooltip && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="h-4 w-4 text-muted-foreground ml-auto shrink-0 cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-[200px] text-xs">{feature.tooltip}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </li>
            ))}
          </ul>
        </CardContent>
        
        <CardFooter className="pt-4 pb-8">
          <Button 
            className="w-full" 
            variant={isPopular ? "default" : "outline"}
            onClick={onSelect}
            disabled={disabled}
          >
            {buttonText}
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}

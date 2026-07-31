"use client";

import React from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: "sm" | "md" | "lg";
  interactive?: boolean;
  onChange?: (rating: number) => void;
  showText?: boolean;
  className?: string;
}

export function StarRating({
  rating,
  maxRating = 5,
  size = "md",
  interactive = false,
  onChange,
  showText = false,
  className,
}: StarRatingProps) {
  const iconSizes = {
    sm: "h-3.5 w-3.5",
    md: "h-5 w-5",
    lg: "h-6 w-6",
  };

  const handleSelect = (val: number) => {
    if (interactive && onChange) {
      onChange(val);
    }
  };

  return (
    <div className={cn("inline-flex items-center gap-1", className)}>
      <div 
        className="flex items-center gap-0.5" 
        role={interactive ? "radiogroup" : "img"}
        aria-label={`Rating: ${rating} out of ${maxRating} stars`}
      >
        {Array.from({ length: maxRating }).map((_, idx) => {
          const starValue = idx + 1;
          const isFilled = starValue <= Math.floor(rating);
          const isHalf = !isFilled && starValue === Math.ceil(rating) && rating % 1 !== 0;

          if (interactive) {
            return (
              <button
                key={starValue}
                type="button"
                role="radio"
                aria-checked={starValue === rating}
                aria-label={`Rate ${starValue} star${starValue > 1 ? "s" : ""}`}
                onClick={() => handleSelect(starValue)}
                className="p-1 text-yellow-400 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary rounded transition-all cursor-pointer"
              >
                <Star
                  className={cn(
                    iconSizes[size],
                    starValue <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300 dark:text-gray-600"
                  )}
                />
              </button>
            );
          }

          return (
            <Star
              key={starValue}
              className={cn(
                iconSizes[size],
                isFilled
                  ? "fill-yellow-400 text-yellow-400"
                  : isHalf
                  ? "fill-yellow-200 text-yellow-400"
                  : "text-gray-300 dark:text-gray-600"
              )}
            />
          );
        })}
      </div>

      {showText && (
        <span className="ml-1 text-sm font-semibold text-foreground">
          {rating > 0 ? rating.toFixed(1) : "0.0"}
        </span>
      )}
    </div>
  );
}

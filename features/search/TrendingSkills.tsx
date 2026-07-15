"use client";

import { Badge } from "@/components/ui/badge";
import { searchService, SearchType } from "@/lib/services/search.service";
import { useQuery } from "@tanstack/react-query";
import { TrendingUp } from "lucide-react";
import React from "react";

interface TrendingSkillsProps {
  type: SearchType;
  onSelect: (term: string) => void;
}

export const TrendingSkills = React.memo(function TrendingSkills({ type, onSelect }: TrendingSkillsProps) {
  // Only show trending skills for Talent and Jobs
  const shouldShow = type === 'talent' || type === 'jobs';

  const { data: trendingSkills, isLoading } = useQuery({
    queryKey: ['search', 'trending'],
    queryFn: () => searchService.getTrendingSkills(),
    enabled: shouldShow,
  });

  if (!shouldShow || isLoading || !trendingSkills || trendingSkills.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center justify-center gap-2 mt-8 text-sm text-muted-foreground opacity-80">
      <span className="font-medium flex items-center gap-1"><TrendingUp className="h-4 w-4" /> Trending Skills:</span>
      {trendingSkills.map((term) => (
        <span
          key={term}
          className="cursor-pointer hover:text-primary transition-colors hover:underline underline-offset-4"
          onClick={() => onSelect(term)}
        >
          {term}
        </span>
      ))}
    </div>
  );
});

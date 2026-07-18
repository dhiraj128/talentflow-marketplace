import React from "react";
import { CandidateMatchCard, CandidateMatchCardProps } from "@/features/employer/shared/CandidateMatchCard";
import { Button } from "@/components/ui/button";
import { ChevronRight, Sparkles } from "lucide-react";
import Link from "next/link";

interface AICandidateRecommendationsProps {
  candidates: CandidateMatchCardProps["candidate"][];
}

export function AICandidateRecommendations({ candidates }: AICandidateRecommendationsProps) {
  if (!candidates || candidates.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold tracking-tight flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-purple-500" />
          AI Candidate Recommendations
        </h2>
        <Button variant="ghost" size="sm" className="hidden md:flex">
          <Link href="/employer/applications?filter=ai-matched" className="flex items-center">
            View All Matches <ChevronRight className="w-4 h-4 ml-1" />
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {candidates.map(candidate => (
          <CandidateMatchCard 
            key={candidate.id} 
            candidate={candidate}
          />
        ))}
      </div>
      
      <Button variant="outline" size="sm" className="w-full md:hidden mt-2">
        <Link href="/employer/applications?filter=ai-matched" className="w-full flex items-center justify-center">
          View All Matches
        </Link>
      </Button>
    </div>
  );
}

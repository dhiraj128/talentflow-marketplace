import React from "react";
import { CandidateCard, CandidateCardProps } from "@/features/employer/shared/CandidateCard";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

interface ShortlistedCandidatesWidgetProps {
  candidates: CandidateCardProps[];
}

export function ShortlistedCandidatesWidget({ candidates }: ShortlistedCandidatesWidgetProps) {
  if (!candidates || candidates.length === 0) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-lg">Shortlisted Candidates</h3>
        <Button variant="ghost" size="sm" className="p-0">
          <Link href="/employer/shortlisted" className="flex items-center px-3 py-1.5 h-full w-full">
            View All <ChevronRight className="w-4 h-4 ml-1" />
          </Link>
        </Button>
      </div>
      <div className="flex flex-col gap-3">
        {candidates.map(candidate => (
          <CandidateCard key={candidate.id} {...candidate} />
        ))}
      </div>
    </div>
  );
}

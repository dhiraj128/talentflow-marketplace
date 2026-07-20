import React from "react";
import { FreelancerCardProps } from "./FreelancerCard";
import { FeaturedFreelancersGrid } from "./FeaturedFreelancersGrid";
import { Sparkles } from "lucide-react";

interface FeaturedFreelancersProps {
  freelancers: FreelancerCardProps[];
}

export function FeaturedFreelancers({ freelancers }: FeaturedFreelancersProps) {
  if (!freelancers || freelancers.length === 0) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Sparkles className="w-5 h-5 text-amber-500" />
        <h2 className="text-2xl font-bold tracking-tight">Top Rated Professionals</h2>
      </div>
      <FeaturedFreelancersGrid freelancers={freelancers} />
    </div>
  );
}

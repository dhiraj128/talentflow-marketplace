import React from "react";
import { FreelancerCard, FreelancerCardProps } from "./FreelancerCard";

interface FreelancerGridProps {
  freelancers: FreelancerCardProps[];
}

export function FreelancerGrid({ freelancers }: FreelancerGridProps) {
  if (!freelancers || freelancers.length === 0) {
    return null; // Handle empty state elsewhere
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {freelancers.map(freelancer => (
        <FreelancerCard key={freelancer.id} {...freelancer} />
      ))}
    </div>
  );
}

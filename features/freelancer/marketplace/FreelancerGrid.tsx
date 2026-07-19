import React from "react";
import { FreelancerCard, FreelancerCardProps } from "./FreelancerCard";

interface FreelancerGridProps {
  freelancers: FreelancerCardProps[];
}

export function FreelancerGrid({ freelancers }: FreelancerGridProps) {
  if (!freelancers || freelancers.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 min-[1920px]:grid-cols-4 gap-4 md:gap-6 lg:gap-8 justify-items-center">
      {freelancers.map(freelancer => (
        <div key={freelancer.id} className="w-full flex justify-center">
          <FreelancerCard {...freelancer} />
        </div>
      ))}
    </div>
  );
}

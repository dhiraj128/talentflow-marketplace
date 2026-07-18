import React from "react";
import { BidCard, BidCardProps } from "@/features/freelancer/shared/BidCard";

interface ProjectInvitationsProps {
  bids: BidCardProps[];
}

export function ProjectInvitations({ bids }: ProjectInvitationsProps) {
  const pendingBids = bids.filter(b => b.status === "PENDING");
  
  if (pendingBids.length === 0) return null;

  return (
    <div className="space-y-4" id="project-invitations">
      <h2 className="text-xl font-semibold tracking-tight">Pending Invitations</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pendingBids.map(bid => (
          <BidCard key={bid.id} {...bid} />
        ))}
      </div>
    </div>
  );
}

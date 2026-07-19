import React from "react";
import { BidCard, BidCardProps } from "@/features/freelancer/shared/BidCard";
import { Card, CardContent } from "@/components/ui/card";
import { MailOpen } from "lucide-react";

interface ProjectInvitationsProps {
  bids: BidCardProps[];
  onActionComplete?: () => void;
}

export function ProjectInvitations({ bids, onActionComplete }: ProjectInvitationsProps) {
  const pendingBids = bids.filter(b => b.status === "PENDING");
  
  if (pendingBids.length === 0) {
    return (
      <div className="space-y-4" id="project-invitations">
        <h2 className="text-xl font-semibold tracking-tight">Pending Invitations</h2>
        <Card className="border-dashed bg-muted/20">
          <CardContent className="flex flex-col items-center justify-center p-12 text-center h-full">
            <MailOpen className="h-10 w-10 text-muted-foreground mb-4 opacity-20" />
            <h3 className="text-lg font-semibold text-muted-foreground">No pending invitations</h3>
            <p className="text-sm text-muted-foreground/60 max-w-sm mt-1">
              You're all caught up. New invitations from employers will appear here.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4" id="project-invitations">
      <h2 className="text-xl font-semibold tracking-tight">Pending Invitations</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
        {pendingBids.map(bid => (
          <BidCard key={bid.id} {...bid} onActionComplete={onActionComplete} />
        ))}
      </div>
    </div>
  );
}

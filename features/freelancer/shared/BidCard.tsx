import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { StatusBadge, StatusType } from "./StatusBadge";
import { Calendar, DollarSign } from "lucide-react";

export interface BidCardProps {
  id: string;
  employerName: string;
  employerAvatar?: string;
  projectTitle: string;
  budget: string;
  deadline: string;
  status: StatusType;
  message?: string;
  onAccept?: () => void;
  onReject?: () => void;
  onView?: () => void;
}

export function BidCard({
  employerName,
  employerAvatar,
  projectTitle,
  budget,
  deadline,
  status,
  message,
  onAccept,
  onReject,
  onView
}: BidCardProps) {
  const isPending = status === "PENDING";

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4 sm:p-5 flex flex-col gap-4">
        <div className="flex justify-between items-start gap-4">
          <div className="flex items-center gap-3">
            <Avatar className="w-10 h-10 border">
              <AvatarImage src={employerAvatar} />
              <AvatarFallback>{employerName.substring(0, 2)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">{employerName}</p>
              <h4 className="font-semibold text-base">{projectTitle}</h4>
            </div>
          </div>
          <StatusBadge status={status} />
        </div>

        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5"><DollarSign className="w-4 h-4" /> {budget}</span>
          <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> {deadline}</span>
        </div>

        {message && (
          <div className="bg-muted/30 p-3 rounded-md text-sm italic text-muted-foreground border-l-2 border-primary/20">
            "{message}"
          </div>
        )}

        {isPending ? (
          <div className="grid grid-cols-2 gap-3 mt-2">
            <Button variant="outline" className="w-full" onClick={onReject}>Decline</Button>
            <Button className="w-full" onClick={onAccept}>Accept Bid</Button>
          </div>
        ) : (
          <div className="mt-2">
            <Button variant="secondary" className="w-full" onClick={onView}>View Details</Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

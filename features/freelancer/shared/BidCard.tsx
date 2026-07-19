import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { StatusBadge, StatusType } from "./StatusBadge";
import { Calendar, DollarSign, Loader2 } from "lucide-react";
import { toast } from "sonner";

export interface BidCardProps {
  id: string;
  employerName: string;
  employerAvatar?: string;
  projectTitle: string;
  budget: string;
  deadline: string;
  status: StatusType;
  message?: string;
  onActionComplete?: () => void;
  onView?: () => void;
}

export function BidCard({
  id,
  employerName,
  employerAvatar,
  projectTitle,
  budget,
  deadline,
  status,
  message,
  onActionComplete,
  onView
}: BidCardProps) {
  const isPending = status === "PENDING";
  const [isLoading, setIsLoading] = useState(false);

  const handleAction = async (newStatus: "ACCEPTED" | "REJECTED") => {
    try {
      setIsLoading(true);
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/project-requests/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) throw new Error("Failed to update status");
      
      toast.success(newStatus === "ACCEPTED" ? "Invitation Accepted" : "Invitation Declined");
      if (onActionComplete) onActionComplete();
    } catch (err) {
      toast.error("Error", { description: "Could not update invitation status" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow h-full flex flex-col">
      <CardContent className="p-4 sm:p-5 flex flex-col gap-4 flex-grow">
        <div className="flex justify-between items-start gap-4">
          <div className="flex items-center gap-3">
            <Avatar className="w-10 h-10 border shrink-0">
              <AvatarImage src={employerAvatar} />
              <AvatarFallback>{employerName.substring(0, 2)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium line-clamp-1">{employerName}</p>
              <h4 className="font-semibold text-base line-clamp-2">{projectTitle}</h4>
            </div>
          </div>
          <div className="shrink-0">
            <StatusBadge status={status} />
          </div>
        </div>

        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5"><DollarSign className="w-4 h-4" /> {budget}</span>
          <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> {deadline}</span>
        </div>

        {message && (
          <div className="bg-muted/30 p-3 rounded-md text-sm italic text-muted-foreground border-l-2 border-primary/20 line-clamp-3">
            "{message}"
          </div>
        )}

        <div className="mt-auto pt-4">
          {isPending ? (
            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" className="w-full" onClick={() => handleAction("REJECTED")} disabled={isLoading}>
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Decline"}
              </Button>
              <Button className="w-full" onClick={() => handleAction("ACCEPTED")} disabled={isLoading}>
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Accept"}
              </Button>
            </div>
          ) : (
            <div>
              <Button variant="secondary" className="w-full" onClick={onView}>View Details</Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

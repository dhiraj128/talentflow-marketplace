"use client";

import React, { useEffect, useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, X, Building, MapPin, DollarSign, Calendar, Eye } from "lucide-react";
import { talentCrmService } from "@/lib/services/talent-crm.service";
import { useAuth } from "@/lib/auth-context";
import { toast } from "sonner";

export default function CandidateInvitationsPage() {
  const { user } = useAuth();
  const [invitations, setInvitations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchInvitations();
  }, [user]);

  const fetchInvitations = async () => {
    setIsLoading(true);
    try {
      const data = await talentCrmService.getCandidateInvitations();
      setInvitations(data || []);
    } catch (err) {
      console.error("Failed to load invitations", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAcceptAndApply = async (invId: string) => {
    try {
      await talentCrmService.acceptInvitationAndApply(invId);
      toast.success("Application Submitted!", {
        description: "Your application has been created and entered the employer's hiring pipeline.",
      });
      fetchInvitations();
    } catch (err: any) {
      toast.error("Application Failed", {
        description: err?.response?.data?.message || "Failed to accept invitation.",
      });
    }
  };

  const handleDecline = async (invId: string) => {
    try {
      await talentCrmService.declineInvitation(invId);
      toast.success("Invitation Declined");
      fetchInvitations();
    } catch (err) {
      toast.error("Failed to decline invitation");
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-6">
      <PageHeader
        title="Job Invitations V1.2"
        description="Review direct job invitations from employers and apply with one click."
      />

      <div className="space-y-4">
        {isLoading ? (
          <div className="p-8 text-center text-muted-foreground">Loading invitations...</div>
        ) : invitations.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground border rounded-xl bg-card">
            No job invitations received yet. Ensure your profile is discoverable to receive employer invites!
          </div>
        ) : (
          invitations.map((inv) => {
            const employer = inv.employer || {};
            const job = inv.job || {};

            return (
              <Card key={inv.id} className="overflow-hidden">
                <CardContent className="p-6 space-y-4">
                  <div className="flex flex-col md:flex-row justify-between gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Building className="w-5 h-5 text-primary" />
                        <h3 className="text-xl font-bold">{job.title || "Position"}</h3>
                        <Badge
                          variant={
                            inv.status === "ACCEPTED" ? "default" :
                            inv.status === "DECLINED" ? "destructive" :
                            inv.status === "CANCELLED" ? "outline" : "secondary"
                          }
                        >
                          {inv.status}
                        </Badge>
                      </div>

                      <p className="text-sm font-semibold text-muted-foreground">
                        {employer.companyName || "Company"}
                      </p>

                      <div className="flex flex-wrap gap-4 text-xs text-muted-foreground pt-1">
                        {job.location && (
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5" /> {job.location}
                          </span>
                        )}
                        {job.salaryRange && (
                          <span className="flex items-center gap-1">
                            <DollarSign className="w-3.5 h-3.5" /> {job.salaryRange}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" /> Invited{" "}
                          {new Date(inv.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col items-end justify-between gap-3">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(`/find-jobs/${job.id}`, "_blank")}
                      >
                        <Eye className="w-4 h-4 mr-1" /> View Job Details
                      </Button>

                      {inv.status === "PENDING" && (
                        <div className="flex gap-2">
                          <Button
                            variant="default"
                            size="sm"
                            className="bg-green-600 hover:bg-green-700 text-white"
                            onClick={() => handleAcceptAndApply(inv.id)}
                          >
                            <Check className="w-4 h-4 mr-1" /> Accept & Apply
                          </Button>

                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-600 hover:bg-red-50 border-red-200"
                            onClick={() => handleDecline(inv.id)}
                          >
                            <X className="w-4 h-4 mr-1" /> Decline
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>

                  {inv.message && (
                    <div className="p-3 bg-muted/40 rounded-lg text-xs space-y-1">
                      <span className="font-semibold text-muted-foreground">Message from Employer:</span>
                      <p className="italic text-foreground">{inv.message}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}

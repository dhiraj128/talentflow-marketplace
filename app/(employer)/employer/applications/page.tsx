"use client";
import React from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Check, X, ShieldCheck, FileText, Zap } from "lucide-react";
import { useEffect, useState } from "react";
import { applicationService } from "@/lib/services/application.service";
import { useAuth } from "@/lib/auth-context";
import { toast } from "sonner";

export default function ApplicationsPage() {
  const { user } = useAuth();
  const [applications, setApplications] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchApplications();
  }, [user]);

  const fetchApplications = async () => {
    const employerId = (user as any)?.profile?.id;
    if (!employerId) {
      setIsLoading(false);
      return;
    }
    try {
      const data = await applicationService.getEmployerApplications();
      setApplications(data);
    } catch (error) {
      console.error("Failed to load applications", error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateStatus = async (appId: string, status: string) => {
    try {
      await applicationService.updateApplicationStatus(appId, status);
      toast.success("Success", { description: `Application status updated to ${status}` });
      fetchApplications();
    } catch (err) {
      toast.error("Error", { description: "Failed to update status." });
    }
  };


  return (
    <div className="max-w-7xl mx-auto p-8 space-y-8">
      <PageHeader title="All Applications" description="Review and manage candidates who have applied." />
      
      <div className="grid grid-cols-1 gap-6">
        {isLoading ? (
          <div className="text-center text-muted-foreground py-8">Loading applications...</div>
        ) : applications.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">No applications found.</div>
        ) : applications.map(app => {
          const candidate = app.candidate || {};
          const candidateName = candidate.fullName || "Unknown Candidate";
          const candidateRole = candidate.title || "Applicant";
          const identityVerified = true; // Placeholder
          const atsOptimized = true; // Placeholder
          const resumeScore = app.matchScore || 0;
          const resumeType = "Traditional"; // Placeholder
          
          return (
          <Card key={app.id} className="overflow-hidden">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row justify-between gap-4">
                <div className="space-y-3">
                  <div>
                    <h3 className="text-xl font-bold flex items-center gap-2">
                      {candidateName}
                      {identityVerified && (
                        <ShieldCheck className="w-5 h-5 text-green-500" />
                      )}
                    </h3>
                    <p className="text-muted-foreground">{candidateRole} • Applied for: {app.job?.title}</p>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {identityVerified && (
                      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                        Identity Verified
                      </Badge>
                    )}
                    {atsOptimized && (
                      <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 gap-1">
                        <Zap className="w-3 h-3" /> ATS Optimized
                      </Badge>
                    )}
                    <Badge variant="outline" className={
                      resumeScore >= 80 ? "bg-green-50 text-green-700 border-green-200" : 
                      resumeScore >= 60 ? "bg-amber-50 text-amber-700 border-amber-200" : 
                      "bg-red-50 text-red-700 border-red-200"
                    }>
                      Match Score: {resumeScore}%
                    </Badge>
                    <Badge variant="secondary" className="gap-1">
                      <FileText className="w-3 h-3" /> {resumeType}
                    </Badge>
                    <Badge variant="outline" className="ml-2">
                      Status: {app.status}
                    </Badge>
                  </div>
                </div>
                
                <div className="flex flex-col items-end justify-between gap-4">
                  <p className="text-sm text-muted-foreground">Applied {new Date(app.appliedAt).toLocaleDateString()}</p>
                  <div className="flex flex-wrap gap-2 justify-end">
                    <Button variant="outline" size="sm" className="min-h-[44px]">
                      <Eye className="w-4 h-4 mr-2" /> View Resume
                    </Button>
                    {app.status === "PENDING" && (
                      <Button variant="outline" size="sm" className="min-h-[44px] bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-200" onClick={() => updateStatus(app.id, "REVIEWING")}>
                        <Check className="w-4 h-4 mr-1" /> Shortlist
                      </Button>
                    )}
                    {app.status === "REVIEWING" && (
                      <Button variant="outline" size="sm" className="min-h-[44px] bg-amber-50 text-amber-700 hover:bg-amber-100 border-amber-200" onClick={() => updateStatus(app.id, "INTERVIEWING")}>
                        <Check className="w-4 h-4 mr-1" /> Interview
                      </Button>
                    )}
                    {app.status === "INTERVIEWING" && (
                      <Button variant="default" size="sm" className="min-h-[44px] bg-green-600 hover:bg-green-700" onClick={() => updateStatus(app.id, "OFFERED")}>
                        <Check className="w-4 h-4 mr-1" /> Offer Job
                      </Button>
                    )}
                    {["PENDING", "REVIEWING", "INTERVIEWING"].includes(app.status) && (
                      <Button variant="outline" size="sm" className="min-h-[44px] text-red-600 border-red-200 hover:bg-red-50" onClick={() => updateStatus(app.id, "REJECTED")}>
                        <X className="w-4 h-4" /> Reject
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )})}
      </div>
    </div>
  );
}

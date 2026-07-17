"use client";

import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable } from "@/components/shared/DataTable";
import { Timeline } from "@/components/shared/Timeline";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

import { applicationService } from "@/lib/services/application.service";
import { useAuth } from "@/lib/auth-context";

export default function ApplicationsPage() {
  const { user } = useAuth();
  const [selectedApp, setSelectedApp] = useState<any>(null);
  const [applications, setApplications] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      const candidateId = (user as any)?.profile?.id;
      if (!candidateId) {
        setIsLoading(false);
        return;
      }
      try {
        const data = await applicationService.getApplications({ candidateId });
        setApplications(data);
      } catch (error) {
        console.error("Failed to load applications", error);
      } finally {
        setIsLoading(false);
      }
    };
    if (user) fetchApplications();
  }, [user]);

  const columns = [
    { header: "Role", accessorKey: "job.title" },
    { header: "Company", accessorKey: "job.employer.companyName" },
    { 
      header: "Applied Date", 
      accessorKey: "appliedAt",
      cell: (row: any) => new Date(row.appliedAt).toLocaleDateString()
    },
    { 
      header: "Status", 
      accessorKey: "status",
      cell: (row: any) => (
        <Badge variant={
          row.status === "OFFERED" ? "default" :
          row.status === "INTERVIEWING" ? "secondary" :
          row.status === "REJECTED" ? "destructive" : "outline"
        }>
          {row.status}
        </Badge>
      )
    },
    {
      header: "Actions",
      accessorKey: "actions",
      cell: (row: any) => (
        <Dialog>
          <DialogTrigger render={<Button variant="ghost" size="sm" onClick={() => setSelectedApp(row)} />}>
            <Eye className="h-4 w-4 mr-2" /> View Status
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Application Timeline - {row.job?.employer?.companyName || "Company"}</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <Timeline items={[
                { title: "Application Submitted", description: "Your application was sent", date: new Date(row.appliedAt).toLocaleDateString(), status: "completed" },
                { title: "Resume Review", description: "Recruiter is reviewing your profile", date: "Pending", status: row.status === "PENDING" ? "current" : "completed" },
                { title: "Interview Status", description: "Technical and Cultural rounds", date: "TBD", status: row.status === "INTERVIEWING" ? "current" : (row.status === "OFFERED" || row.status === "REJECTED" ? "completed" : "upcoming") },
                { title: "Offer", description: "Final decision", date: "TBD", status: row.status === "OFFERED" ? "completed" : (row.status === "REJECTED" ? "error" : "upcoming") }
              ]} />
            </div>
          </DialogContent>
        </Dialog>
      )
    }
  ];

  return (
    <div className="max-w-7xl mx-auto p-8 space-y-8">
      <PageHeader 
        title="My Applications" 
        description="Track and manage your job applications"
      />

      <div className="bg-card rounded-xl border">
        {isLoading ? (
          <div className="p-8 text-center text-muted-foreground">Loading applications...</div>
        ) : (
          <DataTable 
            data={applications}
            columns={columns}
            searchKey="job.title"
          />
        )}
      </div>
    </div>
  );
}

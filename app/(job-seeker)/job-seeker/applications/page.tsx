"use client";

import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable } from "@/components/shared/DataTable";
import { Timeline } from "@/components/shared/Timeline";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const APPLICATIONS = [
  { id: 1, role: "Senior Frontend Developer", company: "TechCorp", date: "2024-03-10", status: "Interviewing", type: "Full-time" },
  { id: 2, role: "React Engineer", company: "StartupX", date: "2024-03-08", status: "Offer", type: "Contract" },
  { id: 3, role: "UI Developer", company: "DesignHub", date: "2024-03-05", status: "Applied", type: "Full-time" },
  { id: 4, role: "Frontend Lead", company: "BigTech", date: "2024-03-01", status: "Rejected", type: "Full-time" },
];

export default function ApplicationsPage() {
  const [selectedApp, setSelectedApp] = useState(APPLICATIONS[0]);

  const columns = [
    { header: "Role", accessorKey: "role" },
    { header: "Company", accessorKey: "company" },
    { header: "Applied Date", accessorKey: "date" },
    { 
      header: "Status", 
      accessorKey: "status",
      cell: (row: any) => (
        <Badge variant={
          row.status === "Offer" ? "default" :
          row.status === "Interviewing" ? "secondary" :
          row.status === "Rejected" ? "destructive" : "outline"
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
              <DialogTitle>Application Timeline - {row.company}</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <Timeline items={[
                { title: "Application Submitted", description: "Your application was sent", date: row.date, status: "completed" },
                { title: "Resume Review", description: "Recruiter is reviewing your profile", date: "2 days later", status: row.status !== "Applied" ? "completed" : "current" },
                { title: "Interview Status", description: "Technical and Cultural rounds", date: "TBD", status: row.status === "Interviewing" ? "current" : (row.status === "Offer" || row.status === "Rejected" ? "completed" : "upcoming") },
                { title: "Offer", description: "Final decision", date: "TBD", status: row.status === "Offer" ? "completed" : (row.status === "Rejected" ? "error" : "upcoming") }
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
        <DataTable 
          data={APPLICATIONS}
          columns={columns}
          searchKey="role"
        />
      </div>
    </div>
  );
}

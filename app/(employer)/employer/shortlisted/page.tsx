"use client";
import React from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable } from "@/components/shared/DataTable";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, MessageSquare } from "lucide-react";

export default function ShortlistedPage() {
  const columns = [
    { accessorKey: "candidate", header: "Candidate Name" },
    { accessorKey: "role", header: "Target Role" },
    { accessorKey: "matchScore", header: "Match Score" },
    { 
      id: "actions",
      header: "Actions",
      cell: () => (
        <div className="flex gap-2">
          <Button variant="outline" size="sm"><Calendar className="w-4 h-4 mr-2" /> Schedule</Button>
          <Button variant="outline" size="sm"><MessageSquare className="w-4 h-4 mr-2" /> Message</Button>
        </div>
      )
    },
  ];

  const data = [
    { candidate: "Emily Chen", role: "Product Manager", matchScore: "95%" },
    { candidate: "Michael Ross", role: "Full Stack Dev", matchScore: "88%" },
  ];

  return (
    <div className="max-w-7xl mx-auto p-8 space-y-8">
      <PageHeader title="Shortlisted Candidates" description="Candidates you have moved to the next round." />
      <Card>
        <CardContent className="pt-6">
          <DataTable columns={columns} data={data} searchKey="candidate" />
        </CardContent>
      </Card>
    </div>
  );
}

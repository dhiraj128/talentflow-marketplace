"use client";
import React from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable } from "@/components/shared/DataTable";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Video, Calendar as CalendarIcon } from "lucide-react";

export default function InterviewsPage() {
  const columns = [
    { accessorKey: "candidate", header: "Candidate Name" },
    { accessorKey: "role", header: "Role" },
    { accessorKey: "time", header: "Date & Time" },
    { accessorKey: "interviewer", header: "Interviewer" },
    { 
      id: "actions",
      header: "Actions",
      cell: () => (
        <div className="flex gap-2">
          <Button size="sm"><Video className="w-4 h-4 mr-2" /> Join</Button>
          <Button variant="outline" size="sm"><CalendarIcon className="w-4 h-4" /></Button>
        </div>
      )
    },
  ];

  const data = [
    { candidate: "Sarah Jenkins", role: "UI Designer", time: "Oct 20, 2:00 PM", interviewer: "Alex M." },
    { candidate: "David Kim", role: "DevOps Engineer", time: "Oct 21, 10:00 AM", interviewer: "John D." },
  ];

  return (
    <div className="max-w-7xl mx-auto p-8 space-y-8">
      <PageHeader title="Interviews" description="Manage your upcoming interview schedule." actionLabel="Schedule Interview" />
      <Card>
        <CardContent className="pt-6">
          <DataTable columns={columns} data={data} searchKey="candidate" />
        </CardContent>
      </Card>
    </div>
  );
}

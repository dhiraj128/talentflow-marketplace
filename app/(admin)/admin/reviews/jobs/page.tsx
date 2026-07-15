"use client";

import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable } from "@/components/shared/DataTable";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { Check, X, Briefcase } from "lucide-react";

type ReviewJob = { id: string; title: string; company: string; dateSubmitted: string };

const data: ReviewJob[] = [
  { id: "1", title: "Senior Frontend Developer", company: "TechCorp", dateSubmitted: "2023-10-24" },
  { id: "2", title: "Product Manager", company: "Innovate Inc", dateSubmitted: "2023-10-25" },
];

const columns: ColumnDef<ReviewJob>[] = [
  { accessorKey: "title", header: "Job Title" },
  { accessorKey: "company", header: "Company" },
  { accessorKey: "dateSubmitted", header: "Date Submitted" },
  {
    id: "actions",
    header: "Actions",
    cell: () => (
      <div className="flex space-x-2">
        <Button variant="outline" size="sm"><Briefcase className="w-4 h-4 mr-1" /> View</Button>
        <Button variant="default" size="sm" className="bg-green-600 hover:bg-green-700"><Check className="w-4 h-4 mr-1" /> Approve</Button>
        <Button variant="destructive" size="sm"><X className="w-4 h-4 mr-1" /> Reject</Button>
      </div>
    )
  }
];

export default function JobReviewsPage() {
  return (
    <div className="max-w-7xl mx-auto p-8 space-y-8">
      <PageHeader title="Job Reviews" description="Review and approve new job postings" />
      <DataTable columns={columns} data={data} searchKey="title" />
    </div>
  );
}

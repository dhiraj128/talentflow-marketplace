"use client";

import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable } from "@/components/shared/DataTable";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { Check, X, FileText } from "lucide-react";

type ReviewCandidate = { id: string; name: string; dateSubmitted: string; completeness: string };

const data: ReviewCandidate[] = [
  { id: "1", name: "David Miller", dateSubmitted: "2023-10-24", completeness: "95%" },
  { id: "2", name: "Sarah Connor", dateSubmitted: "2023-10-25", completeness: "100%" },
];

const columns: ColumnDef<ReviewCandidate>[] = [
  { accessorKey: "name", header: "Candidate Name" },
  { accessorKey: "dateSubmitted", header: "Date Submitted" },
  { accessorKey: "completeness", header: "Profile Completeness" },
  {
    id: "actions",
    header: "Actions",
    cell: () => (
      <div className="flex space-x-2">
        <Button variant="outline" size="sm"><FileText className="w-4 h-4 mr-1" /> View</Button>
        <Button variant="default" size="sm" className="bg-green-600 hover:bg-green-700"><Check className="w-4 h-4 mr-1" /> Approve</Button>
        <Button variant="destructive" size="sm"><X className="w-4 h-4 mr-1" /> Reject</Button>
      </div>
    )
  }
];

export default function CandidateReviewsPage() {
  return (
    <div className="max-w-7xl mx-auto p-8 space-y-8">
      <PageHeader title="Candidate Reviews" description="Review and approve new candidate profiles" />
      <DataTable columns={columns} data={data} searchKey="name" />
    </div>
  );
}

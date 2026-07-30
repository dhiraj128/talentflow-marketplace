"use client";

import React, { useEffect, useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable } from "@/components/shared/DataTable";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { Check, X, FileText } from "lucide-react";
import api from "@/lib/api";

type ReviewCandidate = { id: string; name?: string; fullName?: string; createdAt?: string; dateSubmitted?: string; completeness?: string };

const columns: ColumnDef<ReviewCandidate>[] = [
  {
    accessorKey: "fullName",
    header: "Candidate Name",
    cell: ({ row }) => row.original.fullName || row.original.name || "Candidate",
  },
  {
    accessorKey: "createdAt",
    header: "Date Submitted",
    cell: ({ row }) => {
      const date = row.original.createdAt || row.original.dateSubmitted;
      return date ? new Date(date).toLocaleDateString() : "N/A";
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <div className="flex space-x-2">
        <Button variant="outline" size="sm" onClick={() => window.open(`/find-talent/${row.original.id}`, '_blank')}>
          <FileText className="w-4 h-4 mr-1" /> View
        </Button>
      </div>
    ),
  },
];

export default function CandidateReviewsPage() {
  const [candidates, setCandidates] = useState<ReviewCandidate[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchCandidates();
  }, []);

  const fetchCandidates = async () => {
    setIsLoading(true);
    try {
      const res = await api.get('/candidates');
      const list = Array.isArray(res.data) ? res.data : res.data?.data || [];
      setCandidates(list);
    } catch (e) {
      console.warn("Failed to load candidates for review", e);
      setCandidates([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8">
      <PageHeader title="Candidate Reviews" description="Review candidate profiles in marketplace" />
      {isLoading ? (
        <div className="p-8 text-center text-muted-foreground">Loading candidate reviews...</div>
      ) : (
        <DataTable columns={columns} data={candidates} searchKey="fullName" />
      )}
    </div>
  );
}

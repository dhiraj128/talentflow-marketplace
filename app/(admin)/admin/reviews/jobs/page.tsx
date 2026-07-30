"use client";

import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable } from "@/components/shared/DataTable";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { Check, X, Briefcase } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import api from "@/lib/api";
import Link from "next/link";

type ReviewJob = {
  id: string;
  title: string;
  employer?: { companyName: string };
  createdAt: string;
  status: string;
};

export default function JobReviewsPage() {
  const queryClient = useQueryClient();

  const { data: rawData, isLoading } = useQuery({
    queryKey: ["adminPendingJobs"],
    queryFn: async () => {
      const res = await api.get("/jobs/admin/pending");
      return res.data?.data || (Array.isArray(res.data) ? res.data : []);
    },
  });

  const approveMutation = useMutation({
    mutationFn: async (id: string) => {
      return api.patch(`/jobs/${id}/approve`);
    },
    onSuccess: () => {
      toast.success("Job approved and published");
      queryClient.invalidateQueries({ queryKey: ["adminPendingJobs"] });
    },
    onError: (err: any) =>
      toast.error(err?.response?.data?.message || "Failed to approve job"),
  });

  const rejectMutation = useMutation({
    mutationFn: async (id: string) => {
      return api.patch(`/jobs/${id}/reject`);
    },
    onSuccess: () => {
      toast.success("Job rejected");
      queryClient.invalidateQueries({ queryKey: ["adminPendingJobs"] });
    },
    onError: (err: any) =>
      toast.error(err?.response?.data?.message || "Failed to reject job"),
  });

  const jobsData: ReviewJob[] = (rawData || []).map((j: any) => ({
    id: j.id,
    title: j.title,
    employer: j.employer,
    createdAt: new Date(j.createdAt || Date.now()).toLocaleDateString(),
    status: j.status,
  }));

  const columns: ColumnDef<ReviewJob>[] = [
    { accessorKey: "title", header: "Job Title" },
    {
      accessorKey: "employer",
      header: "Company",
      cell: ({ row }) => row.original.employer?.companyName || "N/A",
    },
    { accessorKey: "createdAt", header: "Date Submitted" },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const job = row.original;
        return (
          <div className="flex space-x-2">
            <Link href={`/find-jobs/${job.id}`}>
              <Button variant="outline" size="sm">
                <Briefcase className="w-4 h-4 mr-1" /> View
              </Button>
            </Link>
            <Button
              variant="default"
              size="sm"
              className="bg-green-600 hover:bg-green-700"
              onClick={() => approveMutation.mutate(job.id)}
            >
              <Check className="w-4 h-4 mr-1" /> Approve
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => rejectMutation.mutate(job.id)}
            >
              <X className="w-4 h-4 mr-1" /> Reject
            </Button>
          </div>
        );
      },
    },
  ];

  if (isLoading) {
    return <div className="p-8">Loading pending jobs...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto p-8 space-y-8">
      <PageHeader
        title="Job Reviews"
        description="Review and approve new job postings"
      />
      <DataTable columns={columns} data={jobsData} searchKey="title" />
    </div>
  );
}

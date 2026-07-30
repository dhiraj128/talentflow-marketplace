"use client";

import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable } from "@/components/shared/DataTable";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ColumnDef } from "@tanstack/react-table";
import { CheckCircle, XCircle } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import api from "@/lib/api";

type Employer = {
  id: string;
  company: string;
  contact: string;
  jobs: number;
  status: string;
  isVerified: boolean;
};

export default function AdminEmployersPage() {
  const queryClient = useQueryClient();

  const { data: rawEmployers = [], isLoading } = useQuery({
    queryKey: ["adminEmployersList"],
    queryFn: async () => {
      const res = await api.get("/employers?take=100");
      return Array.isArray(res.data) ? res.data : res.data?.data || [];
    },
  });

  const verifyMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: boolean }) => {
      return api.patch(`/employers/${id}`, { isVerified: status });
    },
    onSuccess: () => {
      toast.success("Employer verification status updated");
      queryClient.invalidateQueries({ queryKey: ["adminEmployersList"] });
    },
    onError: (err: any) =>
      toast.error(err?.response?.data?.message || "Failed to update verification"),
  });

  const employersData: Employer[] = (rawEmployers || []).map((e: any) => ({
    id: e.id,
    company: e.companyName || e.user?.email || "Unknown",
    contact: e.user?.email || e.companyWebsite || "N/A",
    jobs: e.jobs?.length || 0,
    status: e.isVerified ? "Verified" : "Unverified",
    isVerified: !!e.isVerified,
  }));

  const columns: ColumnDef<Employer>[] = [
    { accessorKey: "company", header: "Company" },
    { accessorKey: "contact", header: "Contact" },
    { accessorKey: "jobs", header: "Active Jobs" },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        return (
          <Badge variant={status === "Verified" ? "default" : "secondary"}>
            {status}
          </Badge>
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const emp = row.original;
        return (
          <div className="flex space-x-2">
            {!emp.isVerified ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => verifyMutation.mutate({ id: emp.id, status: true })}
              >
                <CheckCircle className="w-4 h-4 mr-1 text-green-600" /> Verify
              </Button>
            ) : (
              <Button
                variant="destructive"
                size="sm"
                onClick={() => verifyMutation.mutate({ id: emp.id, status: false })}
              >
                <XCircle className="w-4 h-4 mr-1" /> Revoke
              </Button>
            )}
          </div>
        );
      },
    },
  ];

  if (isLoading) {
    return <div className="p-8">Loading employers...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto p-8 space-y-8">
      <PageHeader
        title="Employers"
        description="Manage employer organizations and their verification status"
      />
      <DataTable columns={columns} data={employersData} searchKey="company" />
    </div>
  );
}

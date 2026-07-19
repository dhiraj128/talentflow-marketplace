"use client";

import React, { useEffect, useState, useMemo } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable } from "@/components/shared/DataTable";
import { Badge } from "@/components/ui/badge";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Loader2 } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useAuth } from "@/lib/auth-context";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";

export default function ProposalsPage() {
  const { user } = useAuth();
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProposals = async () => {
    try {
      setIsLoading(true);
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/project-requests/freelancer`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        }
      });
      if (!res.ok) throw new Error("Failed to fetch");
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error(err);
      toast.error("Error", { description: "Failed to load proposals." });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchProposals();
  }, [user]);

  const handleWithdraw = async (id: string) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/project-requests/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
        body: JSON.stringify({ status: "REJECTED" })
      });
      if (!res.ok) throw new Error("Failed");
      toast.success("Proposal withdrawn successfully");
      fetchProposals();
    } catch (err) {
      toast.error("Error", { description: "Could not withdraw proposal." });
    }
  };

  const columns: ColumnDef<any>[] = useMemo(() => [
    { 
      accessorKey: "title", 
      header: "Project Title",
      cell: ({ row }) => <span className="font-medium">{row.original.title}</span>
    },
    { 
      accessorKey: "createdAt", 
      header: "Submitted",
      cell: ({ row }) => formatDistanceToNow(new Date(row.original.createdAt), { addSuffix: true })
    },
    { 
      accessorKey: "budget", 
      header: "Bid Amount",
      cell: ({ row }) => `$${row.original.budget}`
    },
    { 
      accessorKey: "status", 
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.status as string;
        let variant: "default" | "secondary" | "destructive" | "outline" = "default";
        if (status === "PENDING") variant = "secondary";
        else if (status === "REJECTED") variant = "destructive";
        else if (status === "ACCEPTED") variant = "default";
        else if (status === "COMPLETED") variant = "default";
        return <Badge variant={variant}>{status}</Badge>;
      }
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const isPending = row.original.status === "PENDING";
        return (
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {isPending && (
                <DropdownMenuItem onClick={() => handleWithdraw(row.original.id)} className="text-destructive">
                  Withdraw Proposal
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )
      }
    }
  ], []);

  return (
    <div className="max-w-7xl mx-auto p-8 space-y-8">
      <PageHeader 
        title="Proposals" 
        description="Track your submitted proposals and active interviews."
      />
      <div className="bg-card border rounded-lg p-4">
        <DataTable columns={columns} data={data} searchKey="jobTitle" />
      </div>
    </div>
  );
}

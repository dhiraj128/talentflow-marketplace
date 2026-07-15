"use client";

import React, { useMemo } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable } from "@/components/shared/DataTable";
import { Badge } from "@/components/ui/badge";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface Proposal {
  id: string;
  jobTitle: string;
  submitted: string;
  amount: string;
  status: string;
}

export default function ProposalsPage() {
  const data: Proposal[] = useMemo(() => [
    { id: "1", jobTitle: "Full Stack Next.js Dev needed", submitted: "2 hours ago", amount: "$50/hr", status: "Submitted" },
    { id: "2", jobTitle: "Figma UI/UX for SaaS", submitted: "1 day ago", amount: "$2,000", status: "Viewed" },
    { id: "3", jobTitle: "React Native Mobile App", submitted: "3 days ago", amount: "$3,500", status: "Interviewing" },
    { id: "4", jobTitle: "Python Scripting task", submitted: "1 week ago", amount: "$500", status: "Declined" },
  ], []);

  const columns: ColumnDef<Proposal>[] = useMemo(() => [
    { accessorKey: "jobTitle", header: "Job Title" },
    { accessorKey: "submitted", header: "Submitted" },
    { accessorKey: "amount", header: "Bid Amount" },
    { 
      accessorKey: "status", 
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        let variant: "default" | "secondary" | "destructive" | "outline" = "default";
        if (status === "Submitted") variant = "secondary";
        else if (status === "Declined") variant = "destructive";
        else if (status === "Interviewing") variant = "default";
        return <Badge variant={variant}>{status}</Badge>;
      }
    },
    {
      id: "actions",
      cell: ({ row }) => {
        return (
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>View Job</DropdownMenuItem>
              <DropdownMenuItem>Withdraw Proposal</DropdownMenuItem>
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

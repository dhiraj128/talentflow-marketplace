"use client";

import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable } from "@/components/shared/DataTable";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ColumnDef } from "@tanstack/react-table";
import { CheckCircle, XCircle } from "lucide-react";

type Employer = { id: string; company: string; contact: string; jobs: number; status: string };

const data: Employer[] = [
  { id: "1", company: "TechCorp", contact: "hr@techcorp.com", jobs: 12, status: "Verified" },
  { id: "2", company: "Innovate Inc", contact: "jobs@innovate.com", jobs: 3, status: "Unverified" },
];

const columns: ColumnDef<Employer>[] = [
  { accessorKey: "company", header: "Company" },
  { accessorKey: "contact", header: "Contact" },
  { accessorKey: "jobs", header: "Active Jobs" },
  { 
    accessorKey: "status", 
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return <Badge variant={status === "Verified" ? "default" : "secondary"}>{status}</Badge>;
    }
  },
  {
    id: "actions",
    header: "Actions",
    cell: () => (
      <div className="flex space-x-2">
        <Button variant="outline" size="sm"><CheckCircle className="w-4 h-4 mr-1" /> Verify</Button>
        <Button variant="destructive" size="sm"><XCircle className="w-4 h-4 mr-1" /> Reject</Button>
      </div>
    )
  }
];

export default function AdminEmployersPage() {
  return (
    <div className="max-w-7xl mx-auto p-8 space-y-8">
      <PageHeader title="Employers" description="Manage employer organizations and their verification status" />
      <DataTable columns={columns} data={data} searchKey="company" />
    </div>
  );
}

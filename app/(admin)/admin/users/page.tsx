"use client";

import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable } from "@/components/shared/DataTable";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ColumnDef } from "@tanstack/react-table";
import { UserCheck, UserX, Shield } from "lucide-react";

type User = { id: string; name: string; email: string; role: string; status: string };

const data: User[] = [
  { id: "1", name: "Alice Smith", email: "alice@example.com", role: "Candidate", status: "Active" },
  { id: "2", name: "Bob Jones", email: "bob@example.com", role: "Employer", status: "Pending" },
  { id: "3", name: "Charlie Brown", email: "charlie@example.com", role: "Trainer", status: "Suspended" },
];

const columns: ColumnDef<User>[] = [
  { accessorKey: "name", header: "Name" },
  { accessorKey: "email", header: "Email" },
  { accessorKey: "role", header: "Role" },
  { 
    accessorKey: "status", 
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <Badge variant={status === "Active" ? "default" : status === "Pending" ? "secondary" : "destructive"}>
          {status}
        </Badge>
      );
    }
  },
  {
    id: "actions",
    header: "Actions",
    cell: () => (
      <div className="flex space-x-2">
        <Button variant="outline" size="sm"><UserCheck className="w-4 h-4 mr-1" /> Approve</Button>
        <Button variant="destructive" size="sm"><UserX className="w-4 h-4 mr-1" /> Suspend</Button>
      </div>
    )
  }
];

export default function AdminUsersPage() {
  return (
    <div className="max-w-7xl mx-auto p-8 space-y-8">
      <PageHeader title="User Management" description="Manage system users and their roles" actionLabel="Add Admin" actionIcon={<Shield className="w-4 h-4 mr-2" />} />
      <DataTable columns={columns} data={data} searchKey="name" />
    </div>
  );
}

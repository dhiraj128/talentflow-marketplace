"use client";

import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable } from "@/components/shared/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";

type AuditLog = { id: string; user: string; action: string; resource: string; timestamp: string; status: string };

const data: AuditLog[] = [
  { id: "1", user: "admin@system.com", action: "UPDATE_CONFIG", resource: "MatchingEngine", timestamp: "2023-10-25 14:32:01", status: "Success" },
  { id: "2", user: "moderator@system.com", action: "APPROVE_JOB", resource: "Job_4592", timestamp: "2023-10-25 14:30:44", status: "Success" },
  { id: "3", user: "unknown", action: "LOGIN_ATTEMPT", resource: "Auth", timestamp: "2023-10-25 14:28:12", status: "Failed" },
];

const columns: ColumnDef<AuditLog>[] = [
  { accessorKey: "timestamp", header: "Timestamp" },
  { accessorKey: "user", header: "User" },
  { accessorKey: "action", header: "Action" },
  { accessorKey: "resource", header: "Resource" },
  { 
    accessorKey: "status", 
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return <Badge variant={status === "Success" ? "default" : "destructive"}>{status}</Badge>;
    }
  },
];

export default function AdminAuditPage() {
  return (
    <div className="max-w-7xl mx-auto p-8 space-y-8">
      <PageHeader title="Audit Logs" description="Track system-wide administrative and security events" />
      <DataTable columns={columns} data={data} searchKey="action" />
    </div>
  );
}

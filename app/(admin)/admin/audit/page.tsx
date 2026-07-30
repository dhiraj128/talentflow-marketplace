"use client";

import React, { useEffect, useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable } from "@/components/shared/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import api from "@/lib/api";

type AuditLog = { id: string; user?: string; actionBy?: string; action: string; resource: string; createdAt?: string; timestamp?: string; status?: string };

const columns: ColumnDef<AuditLog>[] = [
  {
    accessorKey: "createdAt",
    header: "Timestamp",
    cell: ({ row }) => {
      const val = row.original.createdAt || row.original.timestamp;
      return val ? new Date(val).toLocaleString() : "N/A";
    },
  },
  {
    accessorKey: "actionBy",
    header: "User / Actor",
    cell: ({ row }) => row.original.actionBy || row.original.user || "System",
  },
  { accessorKey: "action", header: "Action" },
  { accessorKey: "resource", header: "Resource" },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string || "Success";
      return <Badge variant={status === "Success" || status === "SUCCESS" ? "default" : "destructive"}>{status}</Badge>;
    },
  },
];

export default function AdminAuditPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    setIsLoading(true);
    try {
      const res = await api.get('/audit-logs');
      const list = Array.isArray(res.data) ? res.data : res.data?.data || [];
      setLogs(list);
    } catch (e) {
      console.warn("Failed to load audit logs", e);
      setLogs([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8">
      <PageHeader title="Audit Logs" description="Track system-wide administrative and security events" />
      {isLoading ? (
        <div className="p-8 text-center text-muted-foreground">Loading audit logs...</div>
      ) : (
        <DataTable columns={columns} data={logs} searchKey="action" />
      )}
    </div>
  );
}

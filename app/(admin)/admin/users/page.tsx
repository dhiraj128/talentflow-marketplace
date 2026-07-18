"use client";

import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable } from "@/components/shared/DataTable";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ColumnDef } from "@tanstack/react-table";
import { UserCheck, UserX, Shield } from "lucide-react";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { toast } from "sonner";
import { useState } from "react";

type User = { id: string; email: string; role: string; status: string; createdAt: string };

const columns: ColumnDef<User>[] = [
  { accessorKey: "email", header: "Email" },
  { accessorKey: "role", header: "Role" },
  { 
    accessorKey: "status", 
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <Badge variant={status === "ACTIVE" ? "default" : "destructive"}>
          {status}
        </Badge>
      );
    }
  },
  {
    accessorKey: "createdAt",
    header: "Joined",
    cell: ({ row }) => new Date(row.getValue("createdAt")).toLocaleDateString()
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row, table }) => {
      const user = row.original;
      const meta = table.options.meta as any;
      
      return (
        <div className="flex space-x-2">
          {user.status === "ACTIVE" ? (
            <Button variant="destructive" size="sm" onClick={() => meta.updateStatus(user.id, "SUSPENDED")}>
              <UserX className="w-4 h-4 mr-1" /> Suspend
            </Button>
          ) : (
            <Button variant="outline" size="sm" onClick={() => meta.updateStatus(user.id, "ACTIVE")}>
              <UserCheck className="w-4 h-4 mr-1" /> Activate
            </Button>
          )}
        </div>
      );
    }
  }
];

export default function AdminUsersPage() {
  const queryClient = useQueryClient();

  const { data: users = [], isLoading } = useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      const res = await api.get('/users?take=100'); // Fetch up to 100 for now
      return res.data;
    }
  });

  const mutation = useMutation({
    mutationFn: async ({ id, status }: { id: string, status: string }) => {
      const res = await api.patch(`/users/${id}/status`, { status });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      toast.success("User status updated successfully.");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update user status.");
    }
  });

  const handleUpdateStatus = (id: string, status: string) => {
    mutation.mutate({ id, status });
  };

  return (
    <div className="max-w-7xl mx-auto p-8 space-y-8">
      <PageHeader title="User Management" description="Manage system users and their roles" actionLabel="Add Admin" actionIcon={<Shield className="w-4 h-4 mr-2" />} />
      {isLoading ? (
        <div className="text-center py-12 text-muted-foreground">Loading users...</div>
      ) : (
        <DataTable columns={columns} data={users} searchKey="email" meta={{ updateStatus: handleUpdateStatus }} />
      )}
    </div>
  );
}

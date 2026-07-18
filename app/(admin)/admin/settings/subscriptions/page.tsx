"use client";

import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable } from "@/components/shared/DataTable";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ColumnDef } from "@tanstack/react-table";
import { Plus, Edit, Trash2 } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { toast } from "sonner";
import { useState } from "react";

type Subscription = { id: string; userId: string; planId: string; status: string; isActive?: boolean };

const columns: ColumnDef<Subscription>[] = [
  { accessorKey: "userId", header: "User" },
  { accessorKey: "planId", header: "Plan" },
  { 
    accessorKey: "status", 
    header: "Status",
    cell: ({ row }) => (
      <Badge variant={row.getValue("status") ? "default" : "secondary"}>
        {row.getValue("status") ? "Active" : "Inactive"}
      </Badge>
    )
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row, table }) => {
      const item = row.original;
      const meta = table.options.meta as any;
      
      return (
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={() => meta.handleEdit(item)}>
            <Edit className="w-4 h-4 mr-1" /> Edit
          </Button>
          <Button variant="destructive" size="sm" onClick={() => meta.handleDelete(item.id)}>
            <Trash2 className="w-4 h-4 mr-1" /> Delete
          </Button>
        </div>
      );
    }
  }
];

export default function AdminSubscriptionsPage() {
  const queryClient = useQueryClient();

  const { data = [], isLoading } = useQuery({
    queryKey: ['admin-subscriptions'],
    queryFn: async () => {
      const res = await api.get('/subscriptions');
      return res.data;
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await api.delete(`/subscriptions/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-subscriptions'] });
      toast.success("Subscription deleted successfully.");
    },
    onError: () => toast.error("Failed to delete subscription.")
  });

  const handleEdit = (item: any) => {
    toast("Edit functionality coming soon!");
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this subscription?")) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-8 space-y-8">
      <PageHeader 
        title="Subscription Management" 
        description="Manage subscriptions for the platform" 
        actionLabel="Add Subscription" 
        actionIcon={<Plus className="w-4 h-4 mr-2" />} 
        onAction={() => toast("Add functionality coming soon!")}
      />
      {isLoading ? (
        <div className="text-center py-12 text-muted-foreground">Loading...</div>
      ) : (
        <DataTable columns={columns} data={data} searchKey="userId" meta={{ handleEdit, handleDelete }} />
      )}
    </div>
  );
}

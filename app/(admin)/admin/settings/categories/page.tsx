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

type Category = { id: string; name: string; description?: string; isActive: boolean };

const columns: ColumnDef<Category>[] = [
  { accessorKey: "name", header: "Name" },
  { accessorKey: "description", header: "Description" },
  { 
    accessorKey: "isActive", 
    header: "Status",
    cell: ({ row }) => (
      <Badge variant={row.getValue("isActive") ? "default" : "secondary"}>
        {row.getValue("isActive") ? "Active" : "Inactive"}
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

export default function AdminCategorysPage() {
  const queryClient = useQueryClient();

  const { data = [], isLoading } = useQuery({
    queryKey: ['admin-categories'],
    queryFn: async () => {
      const res = await api.get('/categories');
      return res.data;
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await api.delete(`/categories/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
      toast.success("Category deleted successfully.");
    },
    onError: () => toast.error("Failed to delete category.")
  });

  const handleEdit = (item: any) => {
    toast("Edit functionality coming soon!");
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-8 space-y-8">
      <PageHeader 
        title="Category Management" 
        description="Manage categories for the platform" 
        actionLabel="Add Category" 
        actionIcon={<Plus className="w-4 h-4 mr-2" />} 
        onAction={() => toast("Add functionality coming soon!")}
      />
      {isLoading ? (
        <div className="text-center py-12 text-muted-foreground">Loading...</div>
      ) : (
        <DataTable columns={columns} data={data} searchKey="name" meta={{ handleEdit, handleDelete }} />
      )}
    </div>
  );
}

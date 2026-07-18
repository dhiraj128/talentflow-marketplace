"use client";

import React, { useState } from "react";
import { DataTable, ColumnDef } from "@/features/admin/shared/DataTable";
import { StatusBadge } from "@/features/admin/shared/StatusBadge";
import { SearchBar } from "@/features/admin/shared/SearchBar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ConfirmationDialog } from "@/features/admin/shared/ConfirmationDialog";
import { Plus, Edit, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

interface Category {
  id: string;
  name: string;
  slug: string;
  itemCount: number;
  status: "ACTIVE" | "INACTIVE";
}

const mockCategories: Category[] = [
  { id: "c1", name: "Software Development", slug: "software-development", itemCount: 1250, status: "ACTIVE" },
  { id: "c2", name: "Marketing", slug: "marketing", itemCount: 840, status: "ACTIVE" },
  { id: "c3", name: "Design", slug: "design", itemCount: 630, status: "ACTIVE" },
  { id: "c4", name: "Finance", slug: "finance", itemCount: 420, status: "INACTIVE" },
  { id: "c5", name: "Healthcare", slug: "healthcare", itemCount: 310, status: "ACTIVE" },
];

export function CategoryManagement() {
  const [data, setData] = useState<Category[]>(mockCategories);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Dialog states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  // Form states
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: "", status: true });
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const filteredData = data.filter((cat) =>
    cat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData({ name: "", status: true });
    setIsFormOpen(true);
  };

  const handleOpenEdit = (cat: Category) => {
    setEditingId(cat.id);
    setFormData({ name: cat.name, status: cat.status === "ACTIVE" });
    setIsFormOpen(true);
  };

  const handleSave = () => {
    if (!formData.name.trim()) return;

    if (editingId) {
      setData((prev) =>
        prev.map((cat) =>
          cat.id === editingId
            ? { ...cat, name: formData.name, status: formData.status ? "ACTIVE" : "INACTIVE" }
            : cat
        )
      );
    } else {
      const newCat: Category = {
        id: `c${Date.now()}`,
        name: formData.name,
        slug: formData.name.toLowerCase().replace(/\s+/g, "-"),
        itemCount: 0,
        status: formData.status ? "ACTIVE" : "INACTIVE",
      };
      setData((prev) => [newCat, ...prev]);
    }
    setIsFormOpen(false);
  };

  const handleDeleteClick = (id: string) => {
    setDeletingId(id);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (deletingId) {
      setData((prev) => prev.filter((cat) => cat.id !== deletingId));
    }
    setIsDeleteDialogOpen(false);
    setDeletingId(null);
  };

  const columns: ColumnDef<Category>[] = [
    {
      header: "Category Name",
      accessorKey: "name",
      className: "font-medium",
    },
    {
      header: "Slug",
      accessorKey: "slug",
      className: "text-muted-foreground",
    },
    {
      header: "Items",
      accessorKey: "itemCount",
    },
    {
      header: "Status",
      cell: (row) => <StatusBadge status={row.status} />,
    },
    {
      header: "Actions",
      className: "text-right",
      cell: (row) => (
        <div className="flex items-center justify-end gap-2">
          <Button variant="ghost" size="icon" onClick={() => handleOpenEdit(row)}>
            <Edit className="w-4 h-4 text-blue-500" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => handleDeleteClick(row.id)}>
            <Trash2 className="w-4 h-4 text-red-500" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <SearchBar value={searchTerm} onChange={setSearchTerm} placeholder="Search categories..." />
        <Button onClick={handleOpenAdd} className="shrink-0 gap-2">
          <Plus className="w-4 h-4" /> Add Category
        </Button>
      </div>

      <DataTable 
        data={filteredData}
        columns={columns}
        keyExtractor={(row) => row.id}
      />

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit Category" : "Add Category"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Category Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Software Development"
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="status">Active Status</Label>
              <Switch
                id="status"
                checked={formData.status}
                onCheckedChange={(checked) => setFormData({ ...formData, status: checked })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsFormOpen(false)}>Cancel</Button>
            <Button onClick={handleSave}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmationDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        title="Delete Category"
        description="Are you sure you want to delete this category? This action cannot be undone."
        confirmText="Delete"
        isDestructive={true}
        onConfirm={confirmDelete}
      />
    </div>
  );
}

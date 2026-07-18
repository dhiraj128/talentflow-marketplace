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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Designation {
  id: string;
  name: string;
  category: string;
  userCount: number;
  status: "ACTIVE" | "INACTIVE";
}

const mockDesignations: Designation[] = [
  { id: "d1", name: "Software Engineer", category: "Software Development", userCount: 1540, status: "ACTIVE" },
  { id: "d2", name: "UI/UX Designer", category: "Design", userCount: 890, status: "ACTIVE" },
  { id: "d3", name: "HR Manager", category: "Human Resources", userCount: 320, status: "ACTIVE" },
  { id: "d4", name: "Data Scientist", category: "Software Development", userCount: 450, status: "ACTIVE" },
  { id: "d5", name: "DevOps Engineer", category: "Software Development", userCount: 290, status: "ACTIVE" },
];

export function DesignationManagement() {
  const [data, setData] = useState<Designation[]>(mockDesignations);
  const [searchTerm, setSearchTerm] = useState("");
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: "", category: "Software Development", status: true });
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const filteredData = data.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData({ name: "", category: "Software Development", status: true });
    setIsFormOpen(true);
  };

  const handleOpenEdit = (item: Designation) => {
    setEditingId(item.id);
    setFormData({ name: item.name, category: item.category, status: item.status === "ACTIVE" });
    setIsFormOpen(true);
  };

  const handleSave = () => {
    if (!formData.name.trim()) return;

    if (editingId) {
      setData((prev) =>
        prev.map((item) =>
          item.id === editingId
            ? { ...item, name: formData.name, category: formData.category, status: formData.status ? "ACTIVE" : "INACTIVE" }
            : item
        )
      );
    } else {
      const newItem: Designation = {
        id: `d${Date.now()}`,
        name: formData.name,
        category: formData.category,
        userCount: 0,
        status: formData.status ? "ACTIVE" : "INACTIVE",
      };
      setData((prev) => [newItem, ...prev]);
    }
    setIsFormOpen(false);
  };

  const handleDeleteClick = (id: string) => {
    setDeletingId(id);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (deletingId) {
      setData((prev) => prev.filter((item) => item.id !== deletingId));
    }
    setIsDeleteDialogOpen(false);
    setDeletingId(null);
  };

  const columns: ColumnDef<Designation>[] = [
    { header: "Designation Name", accessorKey: "name", className: "font-medium" },
    { header: "Category", accessorKey: "category", className: "text-muted-foreground" },
    { header: "Users", accessorKey: "userCount" },
    { header: "Status", cell: (row) => <StatusBadge status={row.status} /> },
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
        <SearchBar value={searchTerm} onChange={setSearchTerm} placeholder="Search designations..." />
        <Button onClick={handleOpenAdd} className="shrink-0 gap-2">
          <Plus className="w-4 h-4" /> Add Designation
        </Button>
      </div>

      <DataTable data={filteredData} columns={columns} keyExtractor={(row) => row.id} />

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit Designation" : "Add Designation"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Designation Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Software Engineer"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={formData.category} onValueChange={(val) => { if (val) setFormData({...formData, category: val}) }}>
                <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Software Development">Software Development</SelectItem>
                  <SelectItem value="Design">Design</SelectItem>
                  <SelectItem value="Marketing">Marketing</SelectItem>
                  <SelectItem value="Human Resources">Human Resources</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between pt-2">
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
        title="Delete Designation"
        description="Are you sure you want to delete this designation? This action cannot be undone."
        confirmText="Delete"
        isDestructive={true}
        onConfirm={confirmDelete}
      />
    </div>
  );
}

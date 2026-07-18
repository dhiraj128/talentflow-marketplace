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

interface SkillData {
  id: string;
  name: string;
  category: string;
  isPopular: boolean;
  status: "ACTIVE" | "INACTIVE";
}

const mockSkills: SkillData[] = [
  { id: "s1", name: "React", category: "Frontend", isPopular: true, status: "ACTIVE" },
  { id: "s2", name: "Node.js", category: "Backend", isPopular: true, status: "ACTIVE" },
  { id: "s3", name: "Python", category: "Backend", isPopular: true, status: "ACTIVE" },
  { id: "s4", name: "AWS", category: "Cloud", isPopular: true, status: "ACTIVE" },
  { id: "s5", name: "Figma", category: "Design", isPopular: false, status: "ACTIVE" },
];

export function SkillsManagement() {
  const [data, setData] = useState<SkillData[]>(mockSkills);
  const [searchTerm, setSearchTerm] = useState("");
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: "", category: "", isPopular: false, status: true });
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const filteredData = data.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData({ name: "", category: "", isPopular: false, status: true });
    setIsFormOpen(true);
  };

  const handleOpenEdit = (item: SkillData) => {
    setEditingId(item.id);
    setFormData({ name: item.name, category: item.category, isPopular: item.isPopular, status: item.status === "ACTIVE" });
    setIsFormOpen(true);
  };

  const handleSave = () => {
    if (!formData.name.trim()) return;

    if (editingId) {
      setData((prev) =>
        prev.map((item) =>
          item.id === editingId
            ? { ...item, name: formData.name, category: formData.category, isPopular: formData.isPopular, status: formData.status ? "ACTIVE" : "INACTIVE" }
            : item
        )
      );
    } else {
      const newItem: SkillData = {
        id: `s${Date.now()}`,
        name: formData.name,
        category: formData.category || "General",
        isPopular: formData.isPopular,
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

  const columns: ColumnDef<SkillData>[] = [
    { header: "Skill Name", accessorKey: "name", className: "font-medium" },
    { header: "Category", accessorKey: "category", className: "text-muted-foreground" },
    { 
      header: "Popular", 
      cell: (row) => row.isPopular ? <StatusBadge status="YES" className="bg-amber-100 text-amber-800 border-amber-200" /> : <span className="text-muted-foreground">-</span>
    },
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
        <SearchBar value={searchTerm} onChange={setSearchTerm} placeholder="Search skills..." />
        <Button onClick={handleOpenAdd} className="shrink-0 gap-2">
          <Plus className="w-4 h-4" /> Add Skill
        </Button>
      </div>

      <DataTable data={filteredData} columns={columns} keyExtractor={(row) => row.id} />

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit Skill" : "Add Skill"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Skill Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. React"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                placeholder="e.g. Frontend"
              />
            </div>
            <div className="flex items-center justify-between pt-2">
              <Label htmlFor="popular">Mark as Popular</Label>
              <Switch
                id="popular"
                checked={formData.isPopular}
                onCheckedChange={(checked) => setFormData({ ...formData, isPopular: checked })}
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
        title="Delete Skill"
        description="Are you sure you want to delete this skill? This action cannot be undone."
        confirmText="Delete"
        isDestructive={true}
        onConfirm={confirmDelete}
      />
    </div>
  );
}

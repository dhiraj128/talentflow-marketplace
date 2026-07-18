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

interface LocationData {
  id: string;
  country: string;
  state: string;
  city: string;
  status: "ACTIVE" | "INACTIVE";
}

const mockLocations: LocationData[] = [
  { id: "l1", country: "United States", state: "California", city: "San Francisco", status: "ACTIVE" },
  { id: "l2", country: "United States", state: "New York", city: "New York City", status: "ACTIVE" },
  { id: "l3", country: "United Kingdom", state: "England", city: "London", status: "ACTIVE" },
  { id: "l4", country: "Canada", state: "Ontario", city: "Toronto", status: "ACTIVE" },
  { id: "l5", country: "Australia", state: "New South Wales", city: "Sydney", status: "INACTIVE" },
];

export function LocationManagement() {
  const [data, setData] = useState<LocationData[]>(mockLocations);
  const [searchTerm, setSearchTerm] = useState("");
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ country: "", state: "", city: "", status: true });
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const filteredData = data.filter((item) =>
    item.country.toLowerCase().includes(searchTerm.toLowerCase()) || 
    item.state.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData({ country: "", state: "", city: "", status: true });
    setIsFormOpen(true);
  };

  const handleOpenEdit = (item: LocationData) => {
    setEditingId(item.id);
    setFormData({ country: item.country, state: item.state, city: item.city, status: item.status === "ACTIVE" });
    setIsFormOpen(true);
  };

  const handleSave = () => {
    if (!formData.country.trim() || !formData.city.trim()) return;

    if (editingId) {
      setData((prev) =>
        prev.map((item) =>
          item.id === editingId
            ? { ...item, country: formData.country, state: formData.state, city: formData.city, status: formData.status ? "ACTIVE" : "INACTIVE" }
            : item
        )
      );
    } else {
      const newItem: LocationData = {
        id: `l${Date.now()}`,
        country: formData.country,
        state: formData.state,
        city: formData.city,
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

  const columns: ColumnDef<LocationData>[] = [
    { header: "City", accessorKey: "city", className: "font-medium" },
    { header: "State/Province", accessorKey: "state", className: "text-muted-foreground" },
    { header: "Country", accessorKey: "country", className: "text-muted-foreground" },
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
        <SearchBar value={searchTerm} onChange={setSearchTerm} placeholder="Search locations..." />
        <div className="flex gap-2">
          <Button variant="outline" className="shrink-0 gap-2">
            Import CSV
          </Button>
          <Button onClick={handleOpenAdd} className="shrink-0 gap-2">
            <Plus className="w-4 h-4" /> Add Location
          </Button>
        </div>
      </div>

      <DataTable data={filteredData} columns={columns} keyExtractor={(row) => row.id} />

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit Location" : "Add Location"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Input
                id="country"
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                placeholder="e.g. United States"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="state">State / Province</Label>
              <Input
                id="state"
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                placeholder="e.g. California"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                placeholder="e.g. San Francisco"
              />
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
        title="Delete Location"
        description="Are you sure you want to delete this location? This action cannot be undone."
        confirmText="Delete"
        isDestructive={true}
        onConfirm={confirmDelete}
      />
    </div>
  );
}

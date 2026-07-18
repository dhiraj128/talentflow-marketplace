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

interface Offer {
  id: string;
  title: string;
  targetAudience: "ALL" | "EMPLOYERS" | "FREELANCERS" | "JOB_SEEKERS";
  discountPercentage: number;
  startDate: string;
  endDate: string;
  status: "ACTIVE" | "INACTIVE" | "EXPIRED";
}

const mockOffers: Offer[] = [
  { id: "o1", title: "Black Friday Flash Sale", targetAudience: "ALL", discountPercentage: 50, startDate: "2026-11-20", endDate: "2026-11-30", status: "ACTIVE" },
  { id: "o2", title: "New Employer Discount", targetAudience: "EMPLOYERS", discountPercentage: 25, startDate: "2026-01-01", endDate: "2026-12-31", status: "ACTIVE" },
  { id: "o3", title: "Freelancer Pro Upgrade", targetAudience: "FREELANCERS", discountPercentage: 15, startDate: "2026-05-01", endDate: "2026-05-31", status: "EXPIRED" },
];

export function OfferManagement() {
  const [data, setData] = useState<Offer[]>(mockOffers);
  const [searchTerm, setSearchTerm] = useState("");
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ title: "", targetAudience: "ALL", discountPercentage: 0, startDate: "", endDate: "", status: true });
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const filteredData = data.filter((item) =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData({ title: "", targetAudience: "ALL", discountPercentage: 0, startDate: "", endDate: "", status: true });
    setIsFormOpen(true);
  };

  const handleOpenEdit = (item: Offer) => {
    setEditingId(item.id);
    setFormData({ 
      title: item.title, 
      targetAudience: item.targetAudience, 
      discountPercentage: item.discountPercentage, 
      startDate: item.startDate, 
      endDate: item.endDate, 
      status: item.status === "ACTIVE" 
    });
    setIsFormOpen(true);
  };

  const handleSave = () => {
    if (!formData.title.trim()) return;

    if (editingId) {
      setData((prev) =>
        prev.map((item) =>
          item.id === editingId
            ? { ...item, ...formData, targetAudience: formData.targetAudience as any, status: formData.status ? "ACTIVE" : "INACTIVE" }
            : item
        )
      );
    } else {
      const newItem: Offer = {
        id: `o${Date.now()}`,
        title: formData.title,
        targetAudience: formData.targetAudience as any,
        discountPercentage: formData.discountPercentage,
        startDate: formData.startDate,
        endDate: formData.endDate,
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

  const columns: ColumnDef<Offer>[] = [
    { header: "Offer Title", accessorKey: "title", className: "font-medium" },
    { header: "Audience", accessorKey: "targetAudience" },
    { header: "Discount", cell: (row) => `${row.discountPercentage}%` },
    { header: "Duration", cell: (row) => `${row.startDate} to ${row.endDate}` },
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
        <SearchBar value={searchTerm} onChange={setSearchTerm} placeholder="Search offers..." />
        <Button onClick={handleOpenAdd} className="shrink-0 gap-2">
          <Plus className="w-4 h-4" /> Add Offer
        </Button>
      </div>

      <DataTable data={filteredData} columns={columns} keyExtractor={(row) => row.id} />

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit Offer" : "Add Offer"}</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="space-y-2 col-span-2">
              <Label htmlFor="title">Offer Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. Summer Sale 2026"
              />
            </div>
            <div className="space-y-2 col-span-2">
              <Label htmlFor="targetAudience">Target Audience</Label>
              <Select value={formData.targetAudience} onValueChange={(val) => { if (val) setFormData({...formData, targetAudience: val as any}) }}>
                <SelectTrigger><SelectValue placeholder="Select audience" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Users</SelectItem>
                  <SelectItem value="EMPLOYERS">Employers</SelectItem>
                  <SelectItem value="FREELANCERS">Freelancers</SelectItem>
                  <SelectItem value="JOB_SEEKERS">Job Seekers</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2 col-span-2">
              <Label htmlFor="discountPercentage">Discount Percentage (%)</Label>
              <Input
                id="discountPercentage"
                type="number"
                value={formData.discountPercentage}
                onChange={(e) => setFormData({ ...formData, discountPercentage: Number(e.target.value) })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              />
            </div>
            <div className="flex items-center justify-between col-span-2 pt-2">
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
        title="Delete Offer"
        description="Are you sure you want to delete this offer? This action cannot be undone."
        confirmText="Delete"
        isDestructive={true}
        onConfirm={confirmDelete}
      />
    </div>
  );
}

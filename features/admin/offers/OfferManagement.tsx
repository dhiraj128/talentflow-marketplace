"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminService } from "@/lib/services/admin.service";
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
  startDate?: string;
  endDate?: string;
  isActive?: boolean;
}

export function OfferManagement() {
  const queryClient = useQueryClient();
  const { data: offersData = [], isLoading } = useQuery({
    queryKey: ['admin', 'offers'],
    queryFn: adminService.getOffers,
  });

  const data = Array.isArray(offersData) ? offersData : offersData.data || [];
  const [searchTerm, setSearchTerm] = useState("");
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ title: "", targetAudience: "ALL", discountPercentage: 0, startDate: "", endDate: "", isActive: true });
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const createMutation = useMutation({
    mutationFn: adminService.createOffer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'offers'] });
      setIsFormOpen(false);
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => adminService.updateOffer(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'offers'] });
      setIsFormOpen(false);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: adminService.deleteOffer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'offers'] });
      setIsDeleteDialogOpen(false);
      setDeletingId(null);
    }
  });

  const filteredData = data.filter((item: Offer) =>
    item.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData({ title: "", targetAudience: "ALL", discountPercentage: 0, startDate: "", endDate: "", isActive: true });
    setIsFormOpen(true);
  };

  const handleOpenEdit = (item: Offer) => {
    setEditingId(item.id);
    let startDateVal = item.startDate ? new Date(item.startDate).toISOString().split('T')[0] : "";
    let endDateVal = item.endDate ? new Date(item.endDate).toISOString().split('T')[0] : "";

    setFormData({ 
      title: item.title, 
      targetAudience: item.targetAudience || "ALL", 
      discountPercentage: item.discountPercentage, 
      startDate: startDateVal, 
      endDate: endDateVal, 
      isActive: item.isActive !== false 
    });
    setIsFormOpen(true);
  };

  const handleSave = () => {
    if (!formData.title.trim()) return;

    const payload = {
      title: formData.title,
      targetAudience: formData.targetAudience,
      discountPercentage: formData.discountPercentage,
      startDate: formData.startDate ? new Date(formData.startDate).toISOString() : null,
      endDate: formData.endDate ? new Date(formData.endDate).toISOString() : null,
      isActive: formData.isActive,
    };

    if (editingId) {
      updateMutation.mutate({ id: editingId, data: payload });
    } else {
      createMutation.mutate({ id: `o_${Date.now()}`, ...payload });
    }
  };

  const handleDeleteClick = (id: string) => {
    setDeletingId(id);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (deletingId) {
      deleteMutation.mutate(deletingId);
    }
  };

  const columns: ColumnDef<Offer>[] = [
    { header: "Offer Title", accessorKey: "title", className: "font-medium" },
    { header: "Audience", accessorKey: "targetAudience" },
    { header: "Discount", cell: (row) => `${row.discountPercentage}%` },
    { header: "Duration", cell: (row) => `${row.startDate ? new Date(row.startDate).toLocaleDateString() : ""} to ${row.endDate ? new Date(row.endDate).toLocaleDateString() : ""}` },
    { header: "Status", cell: (row) => <StatusBadge status={row.isActive !== false ? "ACTIVE" : "INACTIVE"} /> },
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

      <DataTable data={filteredData} columns={columns} keyExtractor={(row) => row.id} isLoading={isLoading} />

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
                checked={formData.isActive}
                onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsFormOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={createMutation.isPending || updateMutation.isPending}>
                {createMutation.isPending || updateMutation.isPending ? "Saving..." : "Save Changes"}
            </Button>
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

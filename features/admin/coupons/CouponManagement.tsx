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

interface Coupon {
  id: string;
  code: string;
  discountType: "PERCENTAGE" | "FIXED";
  discountValue: number;
  validUntil: string;
  usageLimit: number;
  timesUsed: number;
  status: "ACTIVE" | "INACTIVE" | "EXPIRED";
}

const mockCoupons: Coupon[] = [
  { id: "cp1", code: "SUMMER20", discountType: "PERCENTAGE", discountValue: 20, validUntil: "2026-08-31", usageLimit: 100, timesUsed: 45, status: "ACTIVE" },
  { id: "cp2", code: "WELCOME10", discountType: "FIXED", discountValue: 10, validUntil: "2026-12-31", usageLimit: 500, timesUsed: 312, status: "ACTIVE" },
  { id: "cp3", code: "FLASH50", discountType: "PERCENTAGE", discountValue: 50, validUntil: "2026-06-30", usageLimit: 50, timesUsed: 50, status: "EXPIRED" },
];

export function CouponManagement() {
  const [data, setData] = useState<Coupon[]>(mockCoupons);
  const [searchTerm, setSearchTerm] = useState("");
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ code: "", discountType: "PERCENTAGE", discountValue: 0, validUntil: "", usageLimit: 100, status: true });
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const filteredData = data.filter((item) =>
    item.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData({ code: "", discountType: "PERCENTAGE", discountValue: 0, validUntil: "", usageLimit: 100, status: true });
    setIsFormOpen(true);
  };

  const handleOpenEdit = (item: Coupon) => {
    setEditingId(item.id);
    setFormData({ 
      code: item.code, 
      discountType: item.discountType, 
      discountValue: item.discountValue, 
      validUntil: item.validUntil, 
      usageLimit: item.usageLimit, 
      status: item.status === "ACTIVE" 
    });
    setIsFormOpen(true);
  };

  const handleSave = () => {
    if (!formData.code.trim()) return;

    if (editingId) {
      setData((prev) =>
        prev.map((item) =>
          item.id === editingId
            ? { ...item, ...formData, discountType: formData.discountType as any, status: formData.status ? "ACTIVE" : "INACTIVE" }
            : item
        )
      );
    } else {
      const newItem: Coupon = {
        id: `cp${Date.now()}`,
        code: formData.code.toUpperCase(),
        discountType: formData.discountType as any,
        discountValue: formData.discountValue,
        validUntil: formData.validUntil,
        usageLimit: formData.usageLimit,
        timesUsed: 0,
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

  const columns: ColumnDef<Coupon>[] = [
    { header: "Coupon Code", accessorKey: "code", className: "font-medium" },
    { 
      header: "Discount", 
      cell: (row) => row.discountType === "PERCENTAGE" ? `${row.discountValue}%` : `$${row.discountValue}` 
    },
    { header: "Usage", cell: (row) => `${row.timesUsed} / ${row.usageLimit}` },
    { header: "Valid Until", accessorKey: "validUntil" },
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
        <SearchBar value={searchTerm} onChange={setSearchTerm} placeholder="Search coupons..." />
        <Button onClick={handleOpenAdd} className="shrink-0 gap-2">
          <Plus className="w-4 h-4" /> Add Coupon
        </Button>
      </div>

      <DataTable data={filteredData} columns={columns} keyExtractor={(row) => row.id} />

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit Coupon" : "Add Coupon"}</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="space-y-2 col-span-2">
              <Label htmlFor="code">Coupon Code</Label>
              <Input
                id="code"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                placeholder="e.g. SUMMER20"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="discountType">Discount Type</Label>
              <Select value={formData.discountType} onValueChange={(val) => { if (val) setFormData({...formData, discountType: val as any}) }}>
                <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="PERCENTAGE">Percentage (%)</SelectItem>
                  <SelectItem value="FIXED">Fixed Amount ($)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="discountValue">Discount Value</Label>
              <Input
                id="discountValue"
                type="number"
                value={formData.discountValue}
                onChange={(e) => setFormData({ ...formData, discountValue: Number(e.target.value) })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="validUntil">Valid Until</Label>
              <Input
                id="validUntil"
                type="date"
                value={formData.validUntil}
                onChange={(e) => setFormData({ ...formData, validUntil: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="usageLimit">Usage Limit</Label>
              <Input
                id="usageLimit"
                type="number"
                value={formData.usageLimit}
                onChange={(e) => setFormData({ ...formData, usageLimit: Number(e.target.value) })}
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
        title="Delete Coupon"
        description="Are you sure you want to delete this coupon? This action cannot be undone."
        confirmText="Delete"
        isDestructive={true}
        onConfirm={confirmDelete}
      />
    </div>
  );
}

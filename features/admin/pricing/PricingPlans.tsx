"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminService } from "@/lib/services/admin.service";
import { DataTable, ColumnDef } from "@/features/admin/shared/DataTable";
import { StatusBadge } from "@/features/admin/shared/StatusBadge";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface PricingPlan {
  id: string;
  name: string;
  category: "ATS_RESUME" | "PREMIUM_MEMBERSHIP" | "EMPLOYER_PLAN" | "FEATURED_LISTING" | "COURSE";
  price: number;
  billingCycle: "MONTHLY" | "YEARLY" | "ONE_TIME";
  isActive?: boolean;
}

export function PricingPlans() {
  const queryClient = useQueryClient();
  const { data: plansData = [], isLoading } = useQuery({
    queryKey: ['admin', 'plans'],
    queryFn: adminService.getPlans,
  });

  const data = Array.isArray(plansData) ? plansData : plansData.data || [];
  const [activeTab, setActiveTab] = useState<string>("ALL");
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ 
    name: "", 
    category: "PREMIUM_MEMBERSHIP", 
    price: 0, 
    billingCycle: "MONTHLY", 
    isActive: true 
  });
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const createMutation = useMutation({
    mutationFn: adminService.createPlan,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'plans'] });
      setIsFormOpen(false);
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => adminService.updatePlan(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'plans'] });
      setIsFormOpen(false);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: adminService.deletePlan,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'plans'] });
      setIsDeleteDialogOpen(false);
      setDeletingId(null);
    }
  });

  const filteredData = data.filter((item: PricingPlan) =>
    activeTab === "ALL" || item.category === activeTab
  );

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData({ name: "", category: "PREMIUM_MEMBERSHIP", price: 0, billingCycle: "MONTHLY", isActive: true });
    setIsFormOpen(true);
  };

  const handleOpenEdit = (item: PricingPlan) => {
    setEditingId(item.id);
    setFormData({ 
      name: item.name, 
      category: item.category, 
      price: item.price, 
      billingCycle: item.billingCycle, 
      isActive: item.isActive !== false 
    });
    setIsFormOpen(true);
  };

  const handleSave = () => {
    if (!formData.name.trim()) return;

    if (editingId) {
      updateMutation.mutate({ id: editingId, data: { ...formData, id: editingId } });
    } else {
      createMutation.mutate({ id: `p_${Date.now()}`, ...formData });
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

  const columns: ColumnDef<PricingPlan>[] = [
    { header: "Plan Name", accessorKey: "name", className: "font-medium" },
    { header: "Category", cell: (row) => row.category?.replace(/_/g, " ") || "" },
    { header: "Price", cell: (row) => `$${row.price}` },
    { header: "Billing", accessorKey: "billingCycle" },
    { header: "Status", cell: (row) => <StatusBadge status={row.isActive !== false ? "ACTIVE" : "ARCHIVED"} /> },
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
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full sm:w-auto overflow-x-auto">
          <TabsList>
            <TabsTrigger value="ALL">All Plans</TabsTrigger>
            <TabsTrigger value="PREMIUM_MEMBERSHIP">Membership</TabsTrigger>
            <TabsTrigger value="EMPLOYER_PLAN">Employers</TabsTrigger>
            <TabsTrigger value="ATS_RESUME">ATS Resumes</TabsTrigger>
            <TabsTrigger value="FEATURED_LISTING">Listings</TabsTrigger>
          </TabsList>
        </Tabs>
        <Button onClick={handleOpenAdd} className="shrink-0 gap-2">
          <Plus className="w-4 h-4" /> Add Plan
        </Button>
      </div>

      <DataTable data={filteredData} columns={columns} keyExtractor={(row) => row.id} isLoading={isLoading} />

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit Plan" : "Add Plan"}</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="space-y-2 col-span-2">
              <Label htmlFor="name">Plan Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Employer Starter"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={formData.category} onValueChange={(val) => { if (val) setFormData({...formData, category: val as any}) }}>
                <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="PREMIUM_MEMBERSHIP">Premium Membership</SelectItem>
                  <SelectItem value="EMPLOYER_PLAN">Employer Plan</SelectItem>
                  <SelectItem value="ATS_RESUME">ATS Resume</SelectItem>
                  <SelectItem value="FEATURED_LISTING">Featured Listing</SelectItem>
                  <SelectItem value="COURSE">Course</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="billingCycle">Billing Cycle</Label>
              <Select value={formData.billingCycle} onValueChange={(val) => { if (val) setFormData({...formData, billingCycle: val as any}) }}>
                <SelectTrigger><SelectValue placeholder="Select cycle" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="MONTHLY">Monthly</SelectItem>
                  <SelectItem value="YEARLY">Yearly</SelectItem>
                  <SelectItem value="ONE_TIME">One Time</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2 col-span-2">
              <Label htmlFor="price">Price (USD)</Label>
              <Input
                id="price"
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
              />
            </div>
            <div className="flex items-center justify-between col-span-2 pt-2">
              <Label htmlFor="status">Active Status (Uncheck to Archive)</Label>
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
        title="Archive Plan"
        description="Are you sure you want to archive this plan? It will no longer be available for new subscriptions."
        confirmText="Archive"
        isDestructive={true}
        onConfirm={confirmDelete}
      />
    </div>
  );
}

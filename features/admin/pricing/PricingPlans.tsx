"use client";

import React, { useState } from "react";
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
  status: "ACTIVE" | "ARCHIVED";
}

const mockPlans: PricingPlan[] = [
  { id: "p1", name: "ATS Resume Pro", category: "ATS_RESUME", price: 19, billingCycle: "ONE_TIME", status: "ACTIVE" },
  { id: "p2", name: "Job Seeker Premium", category: "PREMIUM_MEMBERSHIP", price: 29, billingCycle: "MONTHLY", status: "ACTIVE" },
  { id: "p3", name: "Employer Starter", category: "EMPLOYER_PLAN", price: 199, billingCycle: "MONTHLY", status: "ACTIVE" },
  { id: "p4", name: "Employer Enterprise", category: "EMPLOYER_PLAN", price: 1990, billingCycle: "YEARLY", status: "ACTIVE" },
  { id: "p5", name: "Featured Freelancer", category: "FEATURED_LISTING", price: 49, billingCycle: "MONTHLY", status: "ARCHIVED" },
];

export function PricingPlans() {
  const [data, setData] = useState<PricingPlan[]>(mockPlans);
  const [activeTab, setActiveTab] = useState<string>("ALL");
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ 
    name: "", 
    category: "PREMIUM_MEMBERSHIP", 
    price: 0, 
    billingCycle: "MONTHLY", 
    status: true 
  });
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const filteredData = data.filter((item) =>
    activeTab === "ALL" || item.category === activeTab
  );

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData({ name: "", category: "PREMIUM_MEMBERSHIP", price: 0, billingCycle: "MONTHLY", status: true });
    setIsFormOpen(true);
  };

  const handleOpenEdit = (item: PricingPlan) => {
    setEditingId(item.id);
    setFormData({ 
      name: item.name, 
      category: item.category, 
      price: item.price, 
      billingCycle: item.billingCycle, 
      status: item.status === "ACTIVE" 
    });
    setIsFormOpen(true);
  };

  const handleSave = () => {
    if (!formData.name.trim()) return;

    if (editingId) {
      setData((prev) =>
        prev.map((item) =>
          item.id === editingId
            ? { ...item, ...formData, category: formData.category as any, billingCycle: formData.billingCycle as any, status: formData.status ? "ACTIVE" : "ARCHIVED" }
            : item
        )
      );
    } else {
      const newItem: PricingPlan = {
        id: `p${Date.now()}`,
        name: formData.name,
        category: formData.category as any,
        price: formData.price,
        billingCycle: formData.billingCycle as any,
        status: formData.status ? "ACTIVE" : "ARCHIVED",
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

  const columns: ColumnDef<PricingPlan>[] = [
    { header: "Plan Name", accessorKey: "name", className: "font-medium" },
    { header: "Category", cell: (row) => row.category.replace(/_/g, " ") },
    { header: "Price", cell: (row) => `$${row.price}` },
    { header: "Billing", accessorKey: "billingCycle" },
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

      <DataTable data={filteredData} columns={columns} keyExtractor={(row) => row.id} />

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
        title="Archive Plan"
        description="Are you sure you want to archive this plan? It will no longer be available for new subscriptions."
        confirmText="Archive"
        isDestructive={true}
        onConfirm={confirmDelete}
      />
    </div>
  );
}

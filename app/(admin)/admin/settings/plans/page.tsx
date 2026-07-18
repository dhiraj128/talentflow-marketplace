"use client";

import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable } from "@/components/shared/DataTable";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ColumnDef } from "@tanstack/react-table";
import { Plus, Edit, Trash2 } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { toast } from "sonner";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

type Plan = { id: string; name: string; price: number; billingCycle: string; isActive?: boolean };

const columns: ColumnDef<Plan>[] = [
  { accessorKey: "name", header: "Name" },
  { accessorKey: "price", header: "Price" },
  { accessorKey: "billingCycle", header: "Billing" },
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

export default function AdminPlansPage() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<Partial<Plan> | null>(null);

  const { data = [], isLoading } = useQuery({
    queryKey: ['admin-plans'],
    queryFn: async () => {
      const res = await api.get('/plans');
      return res.data?.data || res.data || [];
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await api.delete(`/plans/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-plans'] });
      toast.success("Plan deleted successfully.");
    },
    onError: () => toast.error("Failed to delete plan.")
  });

  const saveMutation = useMutation({
    mutationFn: async (plan: any) => {
      if (plan.id && data.some((p: any) => p.id === plan.id)) {
        const res = await api.patch(`/plans/${plan.id}`, plan);
        return res.data;
      } else {
        const res = await api.post('/plans', plan);
        return res.data;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-plans'] });
      toast.success("Plan saved successfully.");
      setIsModalOpen(false);
    },
    onError: (err: any) => toast.error(err.response?.data?.message || "Failed to save plan.")
  });

  const handleEdit = (item: any) => {
    setEditingPlan(item);
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setEditingPlan({ name: "", price: 0, billingCycle: "MONTHLY", isActive: true });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this plan?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleSave = () => {
    if (!editingPlan?.name || editingPlan.price === undefined) {
      toast.error("Name and price are required");
      return;
    }
    
    const payload = {
      ...editingPlan,
      id: editingPlan.id || editingPlan.name.toUpperCase().replace(/\s+/g, '_'),
      price: Number(editingPlan.price),
      features: (editingPlan as any).features || ["Standard Feature"]
    };
    
    saveMutation.mutate(payload);
  };

  return (
    <div className="max-w-7xl mx-auto p-8 space-y-8">
      <PageHeader 
        title="Plan & Pricing Management" 
        description="Configure pricing plans, including the ATS Resume offering." 
        actionLabel="Add Plan" 
        actionIcon={<Plus className="w-4 h-4 mr-2" />} 
        onAction={handleCreate}
      />
      {isLoading ? (
        <div className="text-center py-12 text-muted-foreground">Loading...</div>
      ) : (
        <DataTable columns={columns} data={data} searchKey="name" meta={{ handleEdit, handleDelete }} />
      )}

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingPlan?.id ? 'Edit Plan' : 'Create Plan'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Plan Name</Label>
              <Input 
                value={editingPlan?.name || ''} 
                onChange={e => setEditingPlan({...editingPlan, name: e.target.value})}
                placeholder="e.g. ATS Resume"
              />
            </div>
            <div className="space-y-2">
              <Label>Price ($)</Label>
              <Input 
                type="number"
                step="0.01"
                value={editingPlan?.price ?? ''} 
                onChange={e => setEditingPlan({...editingPlan, price: parseFloat(e.target.value)})}
              />
            </div>
            <div className="space-y-2">
              <Label>Billing Cycle</Label>
              <Input 
                value={editingPlan?.billingCycle || ''} 
                onChange={e => setEditingPlan({...editingPlan, billingCycle: e.target.value})}
                placeholder="e.g. ONE_TIME or MONTHLY"
              />
            </div>
            <div className="flex items-center justify-between">
              <Label>Active Status</Label>
              <input 
                type="checkbox"
                className="w-4 h-4"
                checked={editingPlan?.isActive ?? true}
                onChange={e => setEditingPlan({...editingPlan, isActive: e.target.checked})}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={saveMutation.isPending}>
              {saveMutation.isPending ? 'Saving...' : 'Save Plan'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

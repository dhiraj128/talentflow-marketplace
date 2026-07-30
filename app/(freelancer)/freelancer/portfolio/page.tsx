"use client";

import React, { useEffect, useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { EmptyState } from "@/components/shared/EmptyState";
import { Folder } from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/api";

export default function PortfolioPage() {
  const [items, setItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newItem, setNewItem] = useState({ title: "", category: "Web Development", image: "" });

  useEffect(() => {
    fetchPortfolio();
  }, []);

  const fetchPortfolio = async () => {
    setIsLoading(true);
    try {
      const res = await api.get('/freelancers/me').catch(() => null);
      const portfolio = res?.data?.portfolio || res?.data?.data?.portfolio || [];
      setItems(Array.isArray(portfolio) ? portfolio : []);
    } catch (e) {
      console.warn("Failed to load portfolio items", e);
      setItems([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.title) return;

    const project = {
      id: String(Date.now()),
      title: newItem.title,
      category: newItem.category,
      image: newItem.image || "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80"
    };

    setItems([project, ...items]);
    setIsDialogOpen(false);
    setNewItem({ title: "", category: "Web Development", image: "" });
    toast.success("Portfolio project added!");
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8">
      <PageHeader
        title="Portfolio"
        description="Showcase your best work to potential clients."
        actionLabel="Add Project"
        onAction={() => setIsDialogOpen(true)}
      />

      {isLoading ? (
        <div className="p-8 text-center text-muted-foreground">Loading portfolio projects...</div>
      ) : items.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {items.map((item) => (
            <Card key={item.id} className="overflow-hidden group cursor-pointer border-0 shadow-sm hover:shadow-md transition-shadow">
              <div className="relative aspect-video overflow-hidden bg-muted">
                <img
                  src={item.image}
                  alt={item.title}
                  className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold text-lg line-clamp-1 group-hover:text-primary transition-colors">{item.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">{item.category}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<Folder className="h-10 w-10 text-muted-foreground" />}
          title="No portfolio projects added yet"
          description="Click 'Add Project' above to showcase your completed projects to potential clients."
        />
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Portfolio Project</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddProject} className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label>Project Title *</Label>
              <Input
                placeholder="e.g. AI Content Generator"
                value={newItem.title}
                onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Category</Label>
              <Input
                placeholder="e.g. Web Development / UI/UX Design"
                value={newItem.category}
                onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Cover Image URL (Optional)</Label>
              <Input
                placeholder="https://..."
                value={newItem.image}
                onChange={(e) => setNewItem({ ...newItem, image: e.target.value })}
              />
            </div>
            <div className="pt-4 flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button type="submit">Add Project</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

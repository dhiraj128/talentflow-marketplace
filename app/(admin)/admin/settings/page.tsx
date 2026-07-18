"use client";

import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Save } from "lucide-react";

export default function AdminSettingsPage() {
  return (
    <div className="max-w-7xl mx-auto p-8 space-y-8">
      <PageHeader 
        title="Global Settings" 
        description="Configure platform-wide settings and toggles" 
        actionLabel="Save Changes" 
        actionIcon={<Save className="w-4 h-4 mr-2" />} 
      />
      
      <div className="bg-card text-card-foreground border p-6 rounded-xl space-y-6">
        <h3 className="text-lg font-semibold">General configuration</h3>
        
        <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Platform Name</label>
            <Input defaultValue="TalentFlow Marketplace" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Support Email</label>
            <Input defaultValue="support@talentflow.com" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Maintenance Mode</label>
            <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background">
              <option value="off">Disabled</option>
              <option value="on">Enabled</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Max Upload Size (MB)</label>
            <Input type="number" defaultValue={50} />
          </div>
        </form>
      </div>

      <div className="bg-card text-card-foreground border p-6 rounded-xl space-y-6">
        <h3 className="text-lg font-semibold">Master Data Management</h3>
        <p className="text-sm text-muted-foreground">Manage global taxonomies used across the platform for dropdowns, matching, and filtering.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <a href="/admin/settings/categories" className="block p-4 border rounded hover:bg-muted transition-colors">
            <h4 className="font-semibold">Categories</h4>
            <p className="text-xs text-muted-foreground mt-1">Manage job categories</p>
          </a>
          <a href="/admin/settings/designations" className="block p-4 border rounded hover:bg-muted transition-colors">
            <h4 className="font-semibold">Designations</h4>
            <p className="text-xs text-muted-foreground mt-1">Manage job roles/titles</p>
          </a>
          <a href="/admin/settings/locations" className="block p-4 border rounded hover:bg-muted transition-colors">
            <h4 className="font-semibold">Locations</h4>
            <p className="text-xs text-muted-foreground mt-1">Manage cities/countries</p>
          </a>
          <a href="/admin/settings/skills" className="block p-4 border rounded hover:bg-muted transition-colors">
            <h4 className="font-semibold">Skills</h4>
            <p className="text-xs text-muted-foreground mt-1">Manage platform skills</p>
          </a>
        </div>
      </div>

      <div className="bg-card text-card-foreground border p-6 rounded-xl space-y-6">
        <h3 className="text-lg font-semibold">Marketing & Growth</h3>
        <p className="text-sm text-muted-foreground">Manage platform promotional offers and discount coupons.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <a href="/admin/settings/coupons" className="block p-4 border rounded hover:bg-muted transition-colors">
            <h4 className="font-semibold">Coupons</h4>
            <p className="text-xs text-muted-foreground mt-1">Manage discount codes</p>
          </a>
          <a href="/admin/settings/offers" className="block p-4 border rounded hover:bg-muted transition-colors">
            <h4 className="font-semibold">Offers</h4>
            <p className="text-xs text-muted-foreground mt-1">Manage promotional banners and deals</p>
          </a>
        </div>
      </div>

      <div className="bg-card text-card-foreground border p-6 rounded-xl space-y-6">
        <h3 className="text-lg font-semibold">Billing & Subscriptions</h3>
        <p className="text-sm text-muted-foreground">Manage platform plans and user subscriptions.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <a href="/admin/settings/plans" className="block p-4 border rounded hover:bg-muted transition-colors">
            <h4 className="font-semibold">Plans</h4>
            <p className="text-xs text-muted-foreground mt-1">Manage pricing plans</p>
          </a>
          <a href="/admin/settings/subscriptions" className="block p-4 border rounded hover:bg-muted transition-colors">
            <h4 className="font-semibold">Subscriptions</h4>
            <p className="text-xs text-muted-foreground mt-1">Manage user subscriptions</p>
          </a>
        </div>
      </div>
    </div>
  );
}

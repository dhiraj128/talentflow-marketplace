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
    </div>
  );
}

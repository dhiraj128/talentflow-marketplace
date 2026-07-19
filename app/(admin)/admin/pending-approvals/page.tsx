import React from "react";
import { CheckSquare } from "lucide-react";

export default function PendingApprovalsPage() {
  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center space-x-3 mb-6">
        <CheckSquare className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold tracking-tight">Pending Approvals</h1>
      </div>
      <p className="text-muted-foreground">Manage pending items requiring admin approval across the platform.</p>
      
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
        <p className="text-sm">Pending approvals list will be displayed here.</p>
      </div>
    </div>
  );
}

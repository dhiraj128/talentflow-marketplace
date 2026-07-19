import React from "react";
import { Users } from "lucide-react";

export default function CandidatesPage() {
  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center space-x-3 mb-6">
        <Users className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold tracking-tight">Candidates Management</h1>
      </div>
      <p className="text-muted-foreground">Manage platform candidates and applicant profiles.</p>
      
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
        <p className="text-sm">Candidate list will be displayed here.</p>
      </div>
    </div>
  );
}

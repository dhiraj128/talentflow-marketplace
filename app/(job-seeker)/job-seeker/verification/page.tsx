"use client";

import React from "react";
import { VerificationModule, VerificationDocument } from "@/components/shared/VerificationModule";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function VerificationPage() {
  const identityDocuments: VerificationDocument[] = [
    { id: "1", type: "Identity", name: "Identity Verification", status: "missing", required: true },
  ];

  const hasIdentityVerified = identityDocuments.some(doc => doc.status === "verified");

  return (
    <div className="max-w-7xl mx-auto p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Trust & Verification</h1>
        <p className="text-muted-foreground mt-2">
          Complete your verification process to unlock full platform features and increase your hiring chances.
        </p>
      </div>

      {!hasIdentityVerified && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Identity Verification Required</AlertTitle>
          <AlertDescription>
            You must verify your identity to apply for jobs and communicate with employers. Please upload at least one valid identity document.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Profile Completion</CardTitle>
            <CardDescription>Complete mandatory fields to activate your profile.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium text-slate-700">Mandatory Requirements</span>
                <span className="font-bold text-slate-900">80%</span>
              </div>
              <Progress value={80} className="h-2 bg-slate-100" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium text-slate-700">Optional Enhancements</span>
                <span className="font-bold text-slate-900">20%</span>
              </div>
              <Progress value={20} className="h-2 bg-slate-100" />
            </div>
          </CardContent>
        </Card>

        <VerificationModule 
          title="Identity Verification"
          description="Upload an official government ID to verify your identity. Only one primary ID is required."
          documents={identityDocuments}
          overallProgress={0}
        />
      </div>
    </div>
  );
}

"use client";

import React from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { VerificationModule } from "@/components/shared/VerificationModule";

export default function SettingsPage() {
  return (
    <div className="max-w-7xl mx-auto p-8 space-y-8">
      <PageHeader 
        title="Settings" 
        description="Manage your profile, account preferences, and security."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile Details</CardTitle>
              <CardDescription>Update your public profile information.</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Professional Title</Label>
                  <Input id="title" defaultValue="Senior Full Stack Developer" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea id="bio" rows={4} defaultValue="Experienced developer specializing in React, Next.js, and Node.js. 5+ years of building scalable web applications." />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hourlyRate">Hourly Rate ($)</Label>
                  <Input id="hourlyRate" type="number" defaultValue="50" />
                </div>
                <Button>Save Profile</Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Account Security</CardTitle>
              <CardDescription>Manage your password and security settings.</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input id="currentPassword" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input id="newPassword" type="password" />
                </div>
                <Button variant="outline">Update Password</Button>
              </form>
            </CardContent>
          </Card>
          
          <VerificationModule 
            title="Freelancer Verification"
            description="Complete verification to build trust and get hired."
            documents={[
              { id: "1", type: "Identity", name: "Identity Verification", status: "missing", required: true },
              { id: "2", type: "Portfolio", name: "Portfolio Link", status: "verified", required: false },
              { id: "3", type: "Tax ID", name: "PAN Card", status: "missing", required: false },
              { id: "4", type: "Finance", name: "Bank Account", status: "missing", required: false },
              { id: "5", type: "Finance", name: "UPI ID", status: "missing", required: false },
              { id: "6", type: "Certificate", name: "Certificates", status: "missing", required: false },
              { id: "7", type: "Reputation", name: "Past Reviews", status: "missing", required: false },
            ]}
            overallProgress={14}
          />
        </div>
      </div>
    </div>
  );
}

import React from "react";
import { VerificationModule } from "@/components/shared/VerificationModule";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function SettingsPage() {
  return (
    <div className="max-w-7xl mx-auto p-8 space-y-8">
      <PageHeader title="Company Settings" description="Update your company profile and preferences." />
      
      <Card>
        <CardHeader>
          <CardTitle>Company Profile</CardTitle>
          <CardDescription>This information will be displayed on your job listings.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="logo">Company Logo URL</Label>
                <Input id="logo" placeholder="https://example.com/logo.png" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="companyName">Company Name</Label>
                <Input id="companyName" placeholder="e.g. Acme Corp" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="industry">Industry</Label>
                <Input id="industry" placeholder="e.g. Technology, Healthcare" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input id="website" placeholder="https://www.acmecorp.com" />
              </div>
            </div>
            <div className="flex justify-end">
              <Button type="submit">Save Changes</Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <VerificationModule 
        title="Company Verification"
        description="Verify your company details to get a verified employer badge."
        documents={[
          { id: "1", type: "Registration", name: "Company Registration", status: "missing", required: true },
          { id: "2", type: "Tax", name: "GST Certificate", status: "missing", required: true },
          { id: "3", type: "Identity", name: "Identity Verification", status: "missing", required: true }
        ]}
        overallProgress={0}
      />
    </div>
  );
}

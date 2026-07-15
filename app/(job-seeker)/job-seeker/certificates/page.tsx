"use client";

import { PageHeader } from "@/components/shared/PageHeader";
import { VerificationModule } from "@/components/shared/VerificationModule";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";

export default function CertificatesPage() {
  return (
    <div className="max-w-7xl mx-auto p-8 space-y-8">
      <PageHeader 
        title="Certifications & Licenses" 
        description="Manage and verify your professional credentials"
        action={<Button><Plus className="h-4 w-4 mr-2" /> Add Certificate</Button>}
      />

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Add New Certificate</CardTitle>
            <CardDescription>Enter details of your certification.</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Certificate Name</Label>
                <Input placeholder="AWS Certified Solutions Architect" />
              </div>
              <div className="space-y-2">
                <Label>Issuing Organization</Label>
                <Input placeholder="Amazon Web Services" />
              </div>
              <div className="space-y-2">
                <Label>Issue Date</Label>
                <Input type="month" />
              </div>
              <div className="space-y-2">
                <Label>Credential ID (Optional)</Label>
                <Input placeholder="ABC-123456" />
              </div>
              <div className="col-span-1 md:col-span-2">
                <Button>Save Certificate</Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <VerificationModule 
          type="document" 
          title="Verify AWS Certification" 
          description="Upload your certificate document for official verification to stand out to employers."
        />
      </div>
    </div>
  );
}

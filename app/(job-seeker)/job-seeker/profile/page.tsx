"use client";

import { PageHeader } from "@/components/shared/PageHeader";
import { ProfileCompletionCard } from "@/components/shared/ProfileCompletionCard";
import { VerificationModule } from "@/components/shared/VerificationModule";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function ProfilePage() {
  return (
    <div className="max-w-7xl mx-auto p-8 space-y-8">
      <PageHeader 
        title="Profile Settings" 
        description="Manage your public profile and preferences"
      />

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>Update your photo and personal details.</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>First Name</Label>
                  <Input placeholder="John" />
                </div>
                <div className="space-y-2">
                  <Label>Last Name</Label>
                  <Input placeholder="Doe" />
                </div>
                <div className="col-span-1 md:col-span-2 space-y-2">
                  <Label>Headline</Label>
                  <Input placeholder="Senior Frontend Developer | React | TypeScript" />
                </div>
                <div className="col-span-1 md:col-span-2 space-y-2">
                  <Label>About</Label>
                  <Textarea placeholder="Tell employers about yourself..." className="h-32" />
                </div>
                <div className="col-span-1 md:col-span-2">
                  <Button>Save Profile</Button>
                </div>
              </form>
            </CardContent>
          </Card>
          
          <VerificationModule 
            type="identity" 
            title="Identity Verification" 
            description="Verify your identity to get a trusted badge on your profile."
          />
        </div>

        <div className="space-y-6">
          <ProfileCompletionCard
            score={85}
            missingItems={[
              { label: "Add Social Links", href: "#socials" },
              { label: "Verify Identity", href: "#verify" },
            ]}
          />

          <Card id="socials">
            <CardHeader>
              <CardTitle>Social Links</CardTitle>
              <CardDescription>Connect your professional networks.</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div className="space-y-2">
                  <Label>LinkedIn</Label>
                  <Input placeholder="https://linkedin.com/in/johndoe" />
                </div>
                <div className="space-y-2">
                  <Label>GitHub</Label>
                  <Input placeholder="https://github.com/johndoe" />
                </div>
                <div className="space-y-2">
                  <Label>Portfolio</Label>
                  <Input placeholder="https://johndoe.com" />
                </div>
                <Button variant="outline" className="w-full">Update Links</Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

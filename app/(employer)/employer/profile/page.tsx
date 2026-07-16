"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { ProfileCompletionCard } from "@/components/shared/ProfileCompletionCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/lib/auth-context";
import { employerService } from "@/lib/services/employer.service";
import { toast } from "sonner";

export default function ProfilePage() {
  const { user } = useAuth();
  const profile = (user as any)?.profile;
  const [formData, setFormData] = useState({
    companyName: "",
    industry: "",
    bio: "",
    location: "",
    websiteUrl: "",
    phone: ""
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (profile) {
      setFormData({
        companyName: profile.companyName || "",
        industry: profile.industry || "",
        bio: profile.bio || "",
        location: profile.location || "",
        websiteUrl: profile.websiteUrl || "",
        phone: profile.phone || ""
      });
    }
  }, [profile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile?.id) return;
    setIsSaving(true);
    try {
      await employerService.updateEmployer(profile.id, formData);
      toast("Profile updated", { description: "Your company information has been saved." });
    } catch (error) {
      toast.error("Error", { description: "Failed to update profile." });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-8 space-y-8">
      <PageHeader 
        title="Company Profile" 
        description="Manage your employer branding and company details"
      />

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Company Details</CardTitle>
              <CardDescription>Update your company public information.</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={handleSaveProfile}>
                <div className="col-span-1 md:col-span-2 space-y-2">
                  <Label>Company Name</Label>
                  <Input name="companyName" value={formData.companyName} onChange={handleChange} placeholder="TechCorp Inc." />
                </div>
                <div className="space-y-2">
                  <Label>Industry</Label>
                  <Input name="industry" value={formData.industry} onChange={handleChange} placeholder="Technology" />
                </div>
                <div className="space-y-2">
                  <Label>Location</Label>
                  <Input name="location" value={formData.location} onChange={handleChange} placeholder="San Francisco, CA" />
                </div>
                <div className="col-span-1 md:col-span-2 space-y-2">
                  <Label>About Company</Label>
                  <Textarea name="bio" value={formData.bio} onChange={handleChange} placeholder="Tell candidates about your company..." className="h-32" />
                </div>
                <div className="space-y-2">
                  <Label>Website URL</Label>
                  <Input name="websiteUrl" value={formData.websiteUrl} onChange={handleChange} placeholder="https://techcorp.com" />
                </div>
                <div className="space-y-2">
                  <Label>Phone</Label>
                  <Input name="phone" value={formData.phone} onChange={handleChange} placeholder="+1 (555) 000-0000" />
                </div>
                <div className="col-span-1 md:col-span-2">
                  <Button type="submit" disabled={isSaving}>{isSaving ? "Saving..." : "Save Profile"}</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <ProfileCompletionCard
            score={80}
            missingItems={[
              { label: "Upload Company Logo", href: "#logo" },
            ]}
          />
        </div>
      </div>
    </div>
  );
}

"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { toast } from "sonner"
import { PageHeader } from "@/components/shared/PageHeader"
import { VerificationModule } from "@/components/shared/VerificationModule"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, Shield, Upload, Loader2, User } from "lucide-react"

export default function SettingsPage() {
  const { user, refreshUser } = useAuth();
  const [isUploading, setIsUploading] = useState(false);

  const handleUploadPhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/file-upload/avatar`, {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        }
      });
      if (!res.ok) throw new Error("Upload failed");
      toast.success("Avatar uploaded", { description: "Your profile photo has been updated." });
      if (refreshUser) await refreshUser();
    } catch (err) {
      toast.error("Upload Error", { description: "Failed to upload avatar." });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <>
      <PageHeader 
        title="Trainer Settings" 
        description="Manage your profile, security, and verification details." 
      />
      
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="mb-8">
          <TabsTrigger value="profile">Public Profile</TabsTrigger>
          <TabsTrigger value="verification">Verification & KYC</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Update your public profile details that students will see.</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-6">
                <div className="flex items-center gap-6">
                  <div className="h-24 w-24 rounded-full bg-muted border-2 flex items-center justify-center overflow-hidden shrink-0">
                    {user?.avatarUrl ? (
                      <img src={user.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      <User className="h-10 w-10 text-muted-foreground" />
                    )}
                  </div>
                  <div>
                    <div className="relative">
                      <Input 
                        type="file" 
                        accept="image/jpeg, image/png, image/webp, image/gif" 
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        onChange={handleUploadPhoto}
                        disabled={isUploading}
                      />
                      <Button type="button" variant="outline" className="mb-2 w-40" disabled={isUploading}>
                        {isUploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Upload new photo"}
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">JPG, PNG, WEBP or GIF. Max size of 5MB</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" defaultValue="Sarah" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" defaultValue="Jenkins" />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="headline">Professional Headline</Label>
                    <Input id="headline" defaultValue="Senior Frontend Engineer & Instructor" />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="bio">Biography</Label>
                    <Textarea id="bio" rows={5} defaultValue="I have been building web applications for over 10 years. My passion is teaching others how to write clean, maintainable code." />
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button>Save Profile</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="verification" className="space-y-6">
          <VerificationModule 
            title="Identity & KYC Verification"
            description="Required to receive payouts and publish courses."
            documents={[
              { id: "1", type: "Identity", name: "Identity Verification", status: "verified", required: true, uploadedAt: "Oct 12, 2023" },
              { id: "2", type: "Education", name: "Education Details", status: "missing", required: false },
              { id: "3", type: "Certificate", name: "Teaching Certificates", status: "missing", required: false },
              { id: "4", type: "Experience", name: "Experience Documents", status: "missing", required: false },
              { id: "5", type: "Course", name: "Course Verification", status: "missing", required: false },
            ]}
            overallProgress={20}
          />
        </TabsContent>
        
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Password & Security</CardTitle>
              <CardDescription>Update your password and secure your account.</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4 max-w-md">
                <div className="space-y-2">
                  <Label htmlFor="current">Current Password</Label>
                  <Input id="current" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new">New Password</Label>
                  <Input id="new" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm">Confirm New Password</Label>
                  <Input id="confirm" type="password" />
                </div>
                <Button className="mt-4">Update Password</Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </>
  )
}

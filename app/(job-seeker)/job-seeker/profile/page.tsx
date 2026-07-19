"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { ProfileCompletionCard } from "@/components/shared/ProfileCompletionCard";
import { VerificationModule } from "@/components/shared/VerificationModule";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/lib/auth-context";
import { candidateService } from "@/lib/services/candidate.service";
import { toast } from "sonner";
import { Award, ExternalLink } from "lucide-react";

export default function ProfilePage() {
  const { user } = useAuth();
  const profile = (user as any)?.profile;
  const [formData, setFormData] = useState({
    fullName: "",
    title: "",
    bio: "",
    linkedinUrl: "",
    githubUrl: "",
    portfolioUrl: "",
    location: "",
    skills: "",
    experience: "",
    education: ""
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isSavingLinks, setIsSavingLinks] = useState(false);

  useEffect(() => {
    if (profile) {
      setFormData({
        fullName: profile.fullName || "",
        title: profile.title || "",
        bio: profile.bio || "",
        linkedinUrl: profile.linkedinUrl || "",
        githubUrl: profile.githubUrl || "",
        portfolioUrl: profile.portfolioUrl || "",
        location: profile.location || "",
        skills: profile.skills?.map((s: any) => s.skill?.name || s.name || s).join(", ") || "",
        experience: profile.experience ? JSON.stringify(profile.experience) : "",
        education: profile.education ? JSON.stringify(profile.education) : ""
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
      const skillsArray = formData.skills ? formData.skills.split(",").map(s => s.trim()).filter(Boolean) : [];
      const expJson = formData.experience ? JSON.parse(formData.experience) : null;
      const eduJson = formData.education ? JSON.parse(formData.education) : null;

      await candidateService.updateCandidate(profile.id, {
        fullName: formData.fullName,
        title: formData.title,
        bio: formData.bio,
        location: formData.location,
        skills: skillsArray,
        experience: expJson,
        education: eduJson
      } as any);
      
      toast("Profile updated", { description: "Your basic information has been saved." });
      
      if ((user as any)?.refreshUser) {
        await (user as any).refreshUser();
      }
    } catch (error) {
      console.error(error);
      toast.error("Error", { description: "Failed to update profile. Ensure JSON arrays are valid." });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveLinks = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile?.id) return;
    setIsSavingLinks(true);
    try {
      await candidateService.updateCandidate(profile.id, {
        linkedinUrl: formData.linkedinUrl,
        githubUrl: formData.githubUrl,
        portfolioUrl: formData.portfolioUrl
      });
      toast("Links updated", { description: "Your social links have been saved." });
      
      if ((user as any)?.refreshUser) {
        await (user as any).refreshUser();
      }
    } catch (error) {
      toast.error("Error", { description: "Failed to update links." });
    } finally {
      setIsSavingLinks(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-8 space-y-8">
      <PageHeader 
        title="Profile Settings" 
        description="Manage your public profile and preferences"
      />

      <div className="grid lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>Update your photo and personal details.</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={handleSaveProfile}>
                <div className="col-span-1 md:col-span-2 space-y-2">
                  <Label>Full Name</Label>
                  <Input name="fullName" value={formData.fullName} onChange={handleChange} placeholder="John Doe" />
                </div>
                <div className="col-span-1 md:col-span-2 space-y-2">
                  <Label>Headline</Label>
                  <Input name="title" value={formData.title} onChange={handleChange} placeholder="Senior Frontend Developer | React | TypeScript" />
                </div>
                <div className="col-span-1 md:col-span-2 space-y-2">
                  <Label>Location</Label>
                  <Input name="location" value={formData.location} onChange={handleChange} placeholder="New York, USA" />
                </div>
                <div className="col-span-1 md:col-span-2 space-y-2">
                  <Label>Skills (Comma separated)</Label>
                  <Input name="skills" value={formData.skills} onChange={handleChange} placeholder="React, Node.js, TypeScript" />
                </div>
                <div className="col-span-1 md:col-span-2 space-y-2">
                  <Label>About</Label>
                  <Textarea name="bio" value={formData.bio} onChange={handleChange} placeholder="Tell employers about yourself..." className="h-32" />
                </div>
                <div className="col-span-1 md:col-span-2 space-y-2">
                  <Label>Experience (JSON array format {`[{"role": "Dev", "company": "Tech Corp"}]`})</Label>
                  <Textarea name="experience" value={formData.experience} onChange={handleChange} placeholder='[{"role": "Developer", "company": "Tech Corp"}]' className="h-24 font-mono text-sm" />
                </div>
                <div className="col-span-1 md:col-span-2 space-y-2">
                  <Label>Education (JSON array format {`[{"degree": "B.Sc", "school": "University"}]`})</Label>
                  <Textarea name="education" value={formData.education} onChange={handleChange} placeholder='[{"degree": "B.Sc", "school": "University"}]' className="h-24 font-mono text-sm" />
                </div>
                <div className="col-span-1 md:col-span-2">
                  <Button type="submit" disabled={isSaving}>{isSaving ? "Saving..." : "Save Profile"}</Button>
                </div>
              </form>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Profile Photo</CardTitle>
              <CardDescription>Upload an avatar to personalize your profile. JPG, PNG (Max 5MB).</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                {profile?.avatarUrl && (
                  <img src={profile.avatarUrl} alt="Avatar" className="w-16 h-16 rounded-full object-cover border" />
                )}
                <div className="flex-1">
                  <Input type="file" accept="image/png, image/jpeg" onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    try {
                      const formData = new FormData();
                      formData.append("file", file);
                      // Use fetch or api to upload directly
                      // Because api might need special config for formData, we'll use api instance
                      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/file-upload/avatar`, {
                        method: 'POST',
                        body: formData,
                        headers: {
                          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
                        }
                      });
                      if (!res.ok) throw new Error("Upload failed");
                      toast("Avatar uploaded", { description: "Your profile photo has been updated." });
                      if ((user as any)?.refreshUser) await (user as any).refreshUser();
                    } catch (err) {
                      toast.error("Upload Error", { description: "Failed to upload avatar." });
                    }
                  }} />
                </div>
              </div>
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
              <form className="space-y-4" onSubmit={handleSaveLinks}>
                <div className="space-y-2">
                  <Label>LinkedIn</Label>
                  <Input name="linkedinUrl" value={formData.linkedinUrl} onChange={handleChange} placeholder="https://linkedin.com/in/johndoe" />
                </div>
                <div className="space-y-2">
                  <Label>GitHub</Label>
                  <Input name="githubUrl" value={formData.githubUrl} onChange={handleChange} placeholder="https://github.com/johndoe" />
                </div>
                <div className="space-y-2">
                  <Label>Portfolio</Label>
                  <Input name="portfolioUrl" value={formData.portfolioUrl} onChange={handleChange} placeholder="https://johndoe.com" />
                </div>
                <Button variant="outline" className="w-full" type="submit" disabled={isSavingLinks}>
                  {isSavingLinks ? "Updating..." : "Update Links"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-3 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Certificates & Training</CardTitle>
              <CardDescription>Verified courses and certifications from the EliteTalent ecosystem.</CardDescription>
            </CardHeader>
            <CardContent>
              {profile?.certificates?.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {profile.certificates.map((cert: any) => (
                    <div key={cert.id} className="border rounded-xl p-4 flex gap-4 items-start">
                      <div className="bg-primary/10 p-3 rounded-lg border">
                        <Award className="w-6 h-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-foreground">{cert.course?.title}</h4>
                        <p className="text-sm text-muted-foreground mb-2">Issued by: {cert.course?.trainer?.fullName || 'TalentFlow'}</p>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" className="h-8 text-xs" onClick={() => window.open(cert.certificateUrl, '_blank')}>
                            <ExternalLink className="w-3 h-3 mr-1" /> View Credential
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground bg-muted/30 rounded-xl border border-dashed">
                  <Award className="w-8 h-8 mx-auto mb-3 text-muted-foreground/50" />
                  <p>You haven't earned any certificates yet.</p>
                  <Button variant="link" className="mt-2 text-primary" onClick={() => window.location.href = '/find-courses'}>
                    Browse Courses
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

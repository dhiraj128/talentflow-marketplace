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
  const [experienceList, setExperienceList] = useState<any[]>([]);
  const [educationList, setEducationList] = useState<any[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isSavingLinks, setIsSavingLinks] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

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
        experience: "",
        education: ""
      });

      // Parse structured experience
      if (Array.isArray(profile.experience)) {
        setExperienceList(profile.experience);
      } else if (typeof profile.experience === "string" && profile.experience.trim()) {
        try {
          const parsed = JSON.parse(profile.experience);
          setExperienceList(Array.isArray(parsed) ? parsed : []);
        } catch (e) {
          setExperienceList([]);
        }
      } else {
        setExperienceList([]);
      }

      // Parse structured education
      if (Array.isArray(profile.education)) {
        setEducationList(profile.education);
      } else if (typeof profile.education === "string" && profile.education.trim()) {
        try {
          const parsed = JSON.parse(profile.education);
          setEducationList(Array.isArray(parsed) ? parsed : []);
        } catch (e) {
          setEducationList([]);
        }
      } else {
        setEducationList([]);
      }
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

      await candidateService.updateCandidate(profile.id, {
        fullName: formData.fullName,
        title: formData.title,
        bio: formData.bio,
        location: formData.location,
        skills: skillsArray,
        experience: experienceList,
        education: educationList
      } as any);
      
      toast.success("Profile updated", { description: "Your profile information has been saved successfully." });
      
      if ((user as any)?.refreshUser) {
        await (user as any).refreshUser();
      }
    } catch (error) {
      console.error(error);
      toast.error("Error", { description: "Failed to update profile." });
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
                
                {/* Structured Experience Section */}
                <div className="col-span-1 md:col-span-2 space-y-4 pt-4 border-t">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-lg">Work Experience</h3>
                      <p className="text-sm text-muted-foreground">Add your relevant work history and achievements.</p>
                    </div>
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        setExperienceList([...experienceList, {
                          id: Date.now().toString(),
                          role: "",
                          company: "",
                          location: "",
                          startDate: "",
                          endDate: "",
                          current: false,
                          description: ""
                        }]);
                      }}
                    >
                      + Add Experience
                    </Button>
                  </div>

                  {experienceList.length === 0 ? (
                    <div className="p-4 text-center border rounded-lg text-sm text-muted-foreground bg-muted/20">
                      No experience added yet. Click "+ Add Experience" above to add your work history.
                    </div>
                  ) : (
                    experienceList.map((exp, idx) => (
                      <div key={exp.id || idx} className="p-4 border rounded-xl space-y-4 bg-card relative">
                        <div className="flex justify-between items-center pb-2 border-b">
                          <span className="font-medium text-sm text-muted-foreground">Experience #{idx + 1}</span>
                          <Button 
                            type="button" 
                            variant="ghost" 
                            size="sm" 
                            className="text-red-500 hover:text-red-700 hover:bg-red-50 h-8 px-2"
                            onClick={() => {
                              setExperienceList(experienceList.filter((_, i) => i !== idx));
                            }}
                          >
                            Remove
                          </Button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <Label className="text-xs">Job Title *</Label>
                            <Input 
                              placeholder="e.g. Senior Software Engineer" 
                              value={exp.role || exp.title || ""} 
                              onChange={(e) => {
                                const updated = [...experienceList];
                                updated[idx].role = e.target.value;
                                setExperienceList(updated);
                              }} 
                            />
                          </div>
                          <div className="space-y-1">
                            <Label className="text-xs">Company *</Label>
                            <Input 
                              placeholder="e.g. Acme Corp" 
                              value={exp.company || ""} 
                              onChange={(e) => {
                                const updated = [...experienceList];
                                updated[idx].company = e.target.value;
                                setExperienceList(updated);
                              }} 
                            />
                          </div>
                          <div className="space-y-1">
                            <Label className="text-xs">Location</Label>
                            <Input 
                              placeholder="e.g. San Francisco, CA / Remote" 
                              value={exp.location || ""} 
                              onChange={(e) => {
                                const updated = [...experienceList];
                                updated[idx].location = e.target.value;
                                setExperienceList(updated);
                              }} 
                            />
                          </div>
                          <div className="flex items-center gap-4 pt-6">
                            <label className="flex items-center gap-2 text-sm cursor-pointer">
                              <input 
                                type="checkbox" 
                                checked={!!exp.current} 
                                onChange={(e) => {
                                  const updated = [...experienceList];
                                  updated[idx].current = e.target.checked;
                                  if (e.target.checked) updated[idx].endDate = "";
                                  setExperienceList(updated);
                                }}
                                className="rounded border-gray-300 text-primary focus:ring-primary"
                              />
                              <span>I currently work here</span>
                            </label>
                          </div>
                          <div className="space-y-1">
                            <Label className="text-xs">Start Date</Label>
                            <Input 
                              type="date" 
                              value={exp.startDate || ""} 
                              onChange={(e) => {
                                const updated = [...experienceList];
                                updated[idx].startDate = e.target.value;
                                setExperienceList(updated);
                              }} 
                            />
                          </div>
                          <div className="space-y-1">
                            <Label className="text-xs">End Date</Label>
                            <Input 
                              type="date" 
                              disabled={!!exp.current} 
                              value={exp.endDate || ""} 
                              onChange={(e) => {
                                const updated = [...experienceList];
                                updated[idx].endDate = e.target.value;
                                setExperienceList(updated);
                              }} 
                            />
                          </div>
                          <div className="col-span-1 md:col-span-2 space-y-1">
                            <Label className="text-xs">Description</Label>
                            <Textarea 
                              placeholder="Describe your responsibilities, key achievements, technologies used..." 
                              value={exp.description || ""} 
                              onChange={(e) => {
                                const updated = [...experienceList];
                                updated[idx].description = e.target.value;
                                setExperienceList(updated);
                              }}
                              className="h-20 text-sm"
                            />
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Structured Education Section */}
                <div className="col-span-1 md:col-span-2 space-y-4 pt-4 border-t">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-lg">Education</h3>
                      <p className="text-sm text-muted-foreground">Add your degrees, certifications, or academic background.</p>
                    </div>
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        setEducationList([...educationList, {
                          id: Date.now().toString(),
                          degree: "",
                          school: "",
                          fieldOfStudy: "",
                          startYear: "",
                          endYear: ""
                        }]);
                      }}
                    >
                      + Add Education
                    </Button>
                  </div>

                  {educationList.length === 0 ? (
                    <div className="p-4 text-center border rounded-lg text-sm text-muted-foreground bg-muted/20">
                      No education added yet. Click "+ Add Education" above to add your qualifications.
                    </div>
                  ) : (
                    educationList.map((edu, idx) => (
                      <div key={edu.id || idx} className="p-4 border rounded-xl space-y-4 bg-card relative">
                        <div className="flex justify-between items-center pb-2 border-b">
                          <span className="font-medium text-sm text-muted-foreground">Education #{idx + 1}</span>
                          <Button 
                            type="button" 
                            variant="ghost" 
                            size="sm" 
                            className="text-red-500 hover:text-red-700 hover:bg-red-50 h-8 px-2"
                            onClick={() => {
                              setEducationList(educationList.filter((_, i) => i !== idx));
                            }}
                          >
                            Remove
                          </Button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <Label className="text-xs">Degree / Certificate *</Label>
                            <Input 
                              placeholder="e.g. B.S. Computer Science" 
                              value={edu.degree || ""} 
                              onChange={(e) => {
                                const updated = [...educationList];
                                updated[idx].degree = e.target.value;
                                setEducationList(updated);
                              }} 
                            />
                          </div>
                          <div className="space-y-1">
                            <Label className="text-xs">Institution / School *</Label>
                            <Input 
                              placeholder="e.g. Stanford University" 
                              value={edu.school || edu.institution || ""} 
                              onChange={(e) => {
                                const updated = [...educationList];
                                updated[idx].school = e.target.value;
                                setEducationList(updated);
                              }} 
                            />
                          </div>
                          <div className="space-y-1">
                            <Label className="text-xs">Field of Study</Label>
                            <Input 
                              placeholder="e.g. Software Engineering" 
                              value={edu.fieldOfStudy || ""} 
                              onChange={(e) => {
                                const updated = [...educationList];
                                updated[idx].fieldOfStudy = e.target.value;
                                setEducationList(updated);
                              }} 
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div className="space-y-1">
                              <Label className="text-xs">Start Year</Label>
                              <Input 
                                placeholder="2018" 
                                value={edu.startYear || ""} 
                                onChange={(e) => {
                                  const updated = [...educationList];
                                  updated[idx].startYear = e.target.value;
                                  setEducationList(updated);
                                }} 
                              />
                            </div>
                            <div className="space-y-1">
                              <Label className="text-xs">End Year</Label>
                              <Input 
                                placeholder="2022" 
                                value={edu.endYear || ""} 
                                onChange={(e) => {
                                  const updated = [...educationList];
                                  updated[idx].endYear = e.target.value;
                                  setEducationList(updated);
                                }} 
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <div className="col-span-1 md:col-span-2 pt-4">
                  <Button type="submit" disabled={isSaving} className="w-full sm:w-auto">{isSaving ? "Saving..." : "Save Profile"}</Button>
                </div>
              </form>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Profile Photo</CardTitle>
              <CardDescription>Upload an avatar to personalize your profile. JPG, PNG or WEBP (Max 5MB).</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden border-2 border-primary/20 shrink-0">
                  {profile?.avatarUrl ? (
                    <img src={profile.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-2xl font-bold text-primary">
                      {formData.fullName?.charAt(0) || user?.email?.charAt(0)?.toUpperCase() || "U"}
                    </span>
                  )}
                </div>
                <div className="flex-1 space-y-2 text-center sm:text-left">
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
                    <label htmlFor="avatar-file-input" className="cursor-pointer">
                      <div className="inline-flex items-center justify-center rounded-lg border border-input bg-background hover:bg-accent hover:text-accent-foreground px-4 py-2 text-sm font-medium transition-colors">
                        {isUploadingAvatar ? "Uploading..." : "Upload Photo"}
                      </div>
                      <input
                        id="avatar-file-input"
                        type="file"
                        accept="image/png, image/jpeg, image/webp"
                        className="hidden"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          if (file.size > 5 * 1024 * 1024) {
                            toast.error("File too large", { description: "Maximum avatar file size is 5MB." });
                            return;
                          }
                          setIsUploadingAvatar(true);
                          try {
                            const body = new FormData();
                            body.append("file", file);
                            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/file-upload/avatar`, {
                              method: 'POST',
                              body,
                              headers: {
                                'Authorization': `Bearer ${localStorage.getItem('access_token')}`
                              }
                            });
                            if (!res.ok) throw new Error("Upload failed");
                            toast.success("Avatar updated", { description: "Your profile photo has been updated." });
                            if ((user as any)?.refreshUser) await (user as any).refreshUser();
                          } catch (err) {
                            toast.error("Upload Error", { description: "Failed to upload avatar." });
                          } finally {
                            setIsUploadingAvatar(false);
                          }
                        }}
                      />
                    </label>
                  </div>
                  <p className="text-xs text-muted-foreground">JPG, PNG or WEBP • Max 5 MB</p>
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

"use client";

import React, { useState, useEffect } from "react";
import { PageContainer } from "@/components/shared/PageContainer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/lib/auth-context";
import { freelancerService } from "@/lib/services/freelancer.service";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

export default function FreelancerProfileSettingsPage() {
  const { user } = useAuth();
  
  const [formData, setFormData] = useState({
    title: "",
    bio: "",
    location: "",
    hourlyRate: "",
    availability: "Immediate",
    skills: [] as string[]
  });
  const [skillInput, setSkillInput] = useState("");

  const { data: profile, isLoading } = useQuery({
    queryKey: ['freelancerProfile', 'me'],
    queryFn: () => freelancerService.getMyProfile(),
    enabled: !!user,
  });

  // Since we might need the actual freelancer profile ID, we'll wait for the profile to load
  // A better way is to create a GET /freelancers/me endpoint, but we can just use the updateMe endpoint to update
  
  useEffect(() => {
    if (profile) {
      setFormData({
        title: profile.title || "",
        bio: profile.bio || "",
        location: profile.location || "",
        hourlyRate: profile.hourlyRate?.toString() || "",
        availability: profile.availability || "Immediate",
        skills: profile.skills?.map((s: any) => s.skill.name) || []
      });
    }
  }, [profile]);

  const updateMutation = useMutation({
    mutationFn: (data: any) => freelancerService.updateMyProfile({
      ...data,
      hourlyRate: data.hourlyRate ? parseFloat(data.hourlyRate) : null
    }),
    onSuccess: () => {
      toast.success("Profile updated successfully");
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Failed to update profile");
    }
  });

  const handleAddSkill = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && skillInput.trim()) {
      e.preventDefault();
      if (!formData.skills.includes(skillInput.trim())) {
        setFormData({ ...formData, skills: [...formData.skills, skillInput.trim()] });
      }
      setSkillInput("");
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setFormData({ ...formData, skills: formData.skills.filter(s => s !== skillToRemove) });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate(formData);
  };

  return (
    <PageContainer>
      <div className="max-w-3xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold">Service Profile</h1>
        <p className="text-muted-foreground">Manage your public marketplace presence.</p>
        
        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle>Professional Details</CardTitle>
              <CardDescription>This information will be displayed to potential clients.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Professional Title</Label>
                <Input value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="e.g. Senior Full Stack Developer" />
              </div>
              
              <div className="space-y-2">
                <Label>Bio / Summary</Label>
                <Textarea value={formData.bio} onChange={e => setFormData({...formData, bio: e.target.value})} placeholder="Describe your experience and expertise..." rows={5} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Hourly Rate ($)</Label>
                  <Input type="number" value={formData.hourlyRate} onChange={e => setFormData({...formData, hourlyRate: e.target.value})} placeholder="e.g. 50" />
                </div>
                <div className="space-y-2">
                  <Label>Location</Label>
                  <Input value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} placeholder="e.g. New York, NY" />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Skills (Press Enter to add)</Label>
                <Input value={skillInput} onChange={e => setSkillInput(e.target.value)} onKeyDown={handleAddSkill} placeholder="e.g. React, Node.js" />
                <div className="flex flex-wrap gap-2 pt-2">
                  {formData.skills.map((skill, idx) => (
                    <Badge key={idx} variant="secondary" className="px-3 py-1 bg-primary/10 text-primary">
                      {skill}
                      <X className="w-3 h-3 ml-2 cursor-pointer" onClick={() => removeSkill(skill)} />
                    </Badge>
                  ))}
                </div>
              </div>

              <Button type="submit" className="w-full mt-4" disabled={updateMutation.isPending}>
                {updateMutation.isPending ? "Saving..." : "Save Profile"}
              </Button>
            </CardContent>
          </Card>
        </form>
      </div>
    </PageContainer>
  );
}

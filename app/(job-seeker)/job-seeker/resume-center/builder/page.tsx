"use client";

import { FileUpload } from "@/components/shared/FileUpload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Save } from "lucide-react";

export default function ResumeBuilderPage() {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Resume Builder</h2>
          <p className="text-muted-foreground">Create and manage your professional profile</p>
        </div>
        <Button><Save className="h-4 w-4 mr-2" /> Save Changes</Button>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="education">Education</TabsTrigger>
          <TabsTrigger value="experience">Experience</TabsTrigger>
          <TabsTrigger value="skills">Skills</TabsTrigger>
          <TabsTrigger value="upload">Upload</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Update your contact details and professional summary.</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Full Name</Label>
                  <Input placeholder="John Doe" />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input type="email" placeholder="john@example.com" />
                </div>
                <div className="space-y-2">
                  <Label>Phone</Label>
                  <Input placeholder="+1 (555) 000-0000" />
                </div>
                <div className="space-y-2">
                  <Label>Location</Label>
                  <Input placeholder="San Francisco, CA" />
                </div>
                <div className="col-span-1 md:col-span-2 space-y-2">
                  <Label>Professional Summary</Label>
                  <Textarea placeholder="Write a brief summary of your expertise..." className="h-32" />
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="education" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Education</CardTitle>
              <CardDescription>Add your academic qualifications.</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Degree</Label>
                  <Input placeholder="Bachelor of Science in Computer Science" />
                </div>
                <div className="space-y-2">
                  <Label>Institution</Label>
                  <Input placeholder="University of Technology" />
                </div>
                <div className="space-y-2">
                  <Label>Start Date</Label>
                  <Input type="month" />
                </div>
                <div className="space-y-2">
                  <Label>End Date</Label>
                  <Input type="month" />
                </div>
                <Button className="w-fit mt-2">Add Education</Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="experience" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Work Experience</CardTitle>
              <CardDescription>Detail your professional journey.</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Job Title</Label>
                  <Input placeholder="Senior Software Engineer" />
                </div>
                <div className="space-y-2">
                  <Label>Company</Label>
                  <Input placeholder="Tech Corp Inc." />
                </div>
                <div className="space-y-2">
                  <Label>Start Date</Label>
                  <Input type="month" />
                </div>
                <div className="space-y-2">
                  <Label>End Date</Label>
                  <Input type="month" />
                </div>
                <div className="col-span-1 md:col-span-2 space-y-2">
                  <Label>Description</Label>
                  <Textarea placeholder="Describe your responsibilities and achievements..." />
                </div>
                <Button className="w-fit mt-2">Add Experience</Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="skills" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Skills & Expertise</CardTitle>
              <CardDescription>Add relevant skills to your profile.</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="col-span-1 md:col-span-2 space-y-2">
                  <Label>Add a Skill</Label>
                  <div className="flex gap-2">
                    <Input placeholder="e.g. React, Python, Project Management" />
                    <Button>Add</Button>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="upload" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Upload Resume</CardTitle>
              <CardDescription>Upload your existing resume in PDF format.</CardDescription>
            </CardHeader>
            <CardContent>
              <FileUpload onFileSelect={() => {}} accept=".pdf,.doc,.docx" maxSize={5} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

import React from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export default function PostJobPage() {
  return (
    <div className="max-w-7xl mx-auto p-8 space-y-8">
      <PageHeader title="Post a New Job" description="Create a new job listing to find top talent." />
      <Card>
        <CardContent className="pt-6">
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="title">Job Title</Label>
                <Input id="title" placeholder="e.g. Software Engineer" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input id="location" placeholder="e.g. Remote, New York, etc." />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Employment Type</Label>
                <Input id="type" placeholder="e.g. Full-time, Contract" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="salary">Salary Range</Label>
                <Input id="salary" placeholder="e.g. $80k - $100k" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Job Description</Label>
              <Textarea id="description" placeholder="Describe the role and requirements" rows={6} />
            </div>
            <div className="flex justify-end gap-4">
              <Button variant="outline" type="button">Cancel</Button>
              <Button type="submit">Publish Job</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

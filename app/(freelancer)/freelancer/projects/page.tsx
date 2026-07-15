"use client";

import React from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function ProjectsPage() {
  return (
    <div className="max-w-7xl mx-auto p-8 space-y-8">
      <PageHeader 
        title="My Projects" 
        description="Manage your ongoing and completed work."
        actionLabel="Browse Jobs"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg">E-Commerce Redesign</CardTitle>
              <p className="text-sm text-muted-foreground">Client: TechCorp Inc.</p>
            </div>
            <Badge variant="default">Active</Badge>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Milestone 2 of 4</span>
                <span className="font-medium">$1,500 pending</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-primary h-2 rounded-full" style={{ width: "50%" }}></div>
              </div>
              <div className="flex justify-end space-x-2 pt-2">
                <Button variant="outline" size="sm">Messages</Button>
                <Button size="sm">Submit Work</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg">Mobile App Development</CardTitle>
              <p className="text-sm text-muted-foreground">Client: StartupX</p>
            </div>
            <Badge variant="secondary">Completed</Badge>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Completed on Oct 12</span>
                <span className="font-medium text-green-600">$3,200 Earned</span>
              </div>
              <div className="flex justify-end space-x-2 pt-2">
                <Button variant="outline" size="sm">View Contract</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

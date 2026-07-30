"use client";

import React, { useEffect, useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FolderKanban } from "lucide-react";
import { analyticsService } from "@/lib/services/analytics.service";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";

export default function ProjectsPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    analyticsService.getFreelancerDashboard()
      .then((res) => {
        setProjects(res?.projects || []);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load projects", err);
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto p-8 space-y-8">
        <Skeleton className="h-12 w-64" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-40 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-8 space-y-8">
      <PageHeader 
        title="My Projects" 
        description="Manage your ongoing and completed work."
        actionLabel="Browse Jobs"
        onAction={() => router.push("/find-jobs")}
      />

      {projects.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-12 text-center">
            <FolderKanban className="w-12 h-12 text-muted-foreground/40 mb-3" />
            <h3 className="font-semibold text-lg">No projects yet</h3>
            <p className="text-sm text-muted-foreground mt-1 max-w-sm">
              You don't have any active or completed client projects yet. Submit proposals to get hired.
            </p>
            <Button className="mt-6" onClick={() => router.push("/find-jobs")}>
              Explore Opportunities
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((project: any) => (
            <Card key={project.id}>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-lg">{project.title}</CardTitle>
                  <p className="text-sm text-muted-foreground">Client: {project.clientName || "Direct Client"}</p>
                </div>
                <Badge variant={project.status === "ACTIVE" ? "default" : "secondary"}>
                  {project.status}
                </Badge>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Contract Budget</span>
                    <span className="font-medium">${project.budget ? project.budget.toLocaleString() : "0"}</span>
                  </div>
                  <div className="flex justify-end space-x-2 pt-2">
                    <Button variant="outline" size="sm" onClick={() => router.push("/messages")}>Messages</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

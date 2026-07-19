import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge, StatusType } from "@/features/freelancer/shared/StatusBadge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Project {
  id: string;
  title: string;
  employerName: string;
  employerAvatar?: string;
  status: StatusType;
  progress: number;
  dueDate: string;
  amount: string;
}

interface RecentProjectsProps {
  projects: Project[];
}

export function RecentProjects({ projects }: RecentProjectsProps) {
  if (!projects || projects.length === 0) {
    return (
      <Card className="w-full h-full flex flex-col">
        <CardHeader>
          <CardTitle>Recent Projects</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center p-12 text-center flex-grow">
          <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-muted-foreground opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-muted-foreground">No recent projects</h3>
          <p className="text-sm text-muted-foreground/60 max-w-sm mt-1">
            Projects you accept will appear here to help you track their progress.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Recent Projects</CardTitle>
      </CardHeader>
      <CardContent className="p-0 md:p-6 md:pt-0">
        
        {/* Mobile View */}
        <div className="md:hidden flex flex-col divide-y">
          {projects.map(project => (
            <div key={project.id} className="p-4 space-y-3">
              <div className="flex justify-between items-start">
                <div className="flex flex-col">
                  <h4 className="font-semibold text-sm">{project.title}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <Avatar className="w-4 h-4">
                      <AvatarImage src={project.employerAvatar} />
                      <AvatarFallback className="text-[8px]">{project.employerName.substring(0, 2)}</AvatarFallback>
                    </Avatar>
                    <span className="text-xs text-muted-foreground">{project.employerName}</span>
                  </div>
                </div>
                <StatusBadge status={project.status} />
              </div>
              
              {project.status === "ACTIVE" && (
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span>Progress</span>
                    <span>{project.progress}%</span>
                  </div>
                  <Progress value={project.progress} className="h-1.5" />
                </div>
              )}

              <div className="flex justify-between items-center text-xs text-muted-foreground pt-1">
                <span>Due: {project.dueDate}</span>
                <span className="font-medium text-foreground">{project.amount}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b">
              <tr>
                <th className="px-4 py-3 font-medium">Project</th>
                <th className="px-4 py-3 font-medium">Client</th>
                <th className="px-4 py-3 font-medium min-w-[150px]">Progress</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Due Date</th>
                <th className="px-4 py-3 font-medium">Amount</th>
                <th className="px-4 py-3 font-medium text-right"></th>
              </tr>
            </thead>
            <tbody>
              {projects.map(project => (
                <tr key={project.id} className="border-b last:border-0 hover:bg-muted/50 transition-colors">
                  <td className="px-4 py-3 font-medium">{project.title}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Avatar className="w-6 h-6">
                        <AvatarImage src={project.employerAvatar} />
                        <AvatarFallback className="text-[10px]">{project.employerName.substring(0, 2)}</AvatarFallback>
                      </Avatar>
                      <span className="text-muted-foreground">{project.employerName}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {project.status === "ACTIVE" ? (
                      <div className="flex items-center gap-2">
                        <Progress value={project.progress} className="h-1.5 flex-1" />
                        <span className="text-xs text-muted-foreground w-8">{project.progress}%</span>
                      </div>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </td>
                  <td className="px-4 py-3"><StatusBadge status={project.status} /></td>
                  <td className="px-4 py-3 text-muted-foreground">{project.dueDate}</td>
                  <td className="px-4 py-3 font-medium">{project.amount}</td>
                  <td className="px-4 py-3 text-right">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

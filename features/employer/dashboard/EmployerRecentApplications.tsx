import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, FileText, Zap } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PremiumBadge } from "@/components/shared/PremiumBadge";

interface Application {
  id: string;
  candidateName: string;
  avatarUrl?: string;
  position: string;
  appliedAt: string;
  atsScore?: number;
  status: string;
  isAtsOptimized: boolean;
}

interface EmployerRecentApplicationsProps {
  applications: Application[];
}

export function EmployerRecentApplications({ applications }: EmployerRecentApplicationsProps) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Recent Applications</CardTitle>
      </CardHeader>
      <CardContent className="p-0 md:p-6 md:pt-0">
        
        {/* Mobile View: Cards */}
        <div className="md:hidden flex flex-col divide-y">
          {applications.map(app => (
            <div key={app.id} className="p-4 space-y-3">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={app.avatarUrl} />
                    <AvatarFallback>{app.candidateName.substring(0, 2)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-sm">{app.candidateName}</p>
                    <p className="text-xs text-muted-foreground">{app.position}</p>
                  </div>
                </div>
                <Badge variant="outline" className="text-[10px]">{app.status}</Badge>
              </div>
              <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                <span>Applied: {new Date(app.appliedAt).toLocaleDateString()}</span>
                {app.atsScore && <span>• ATS: {app.atsScore}%</span>}
                {app.isAtsOptimized && <PremiumBadge />}
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="w-full h-8 text-xs">Review</Button>
                <Button variant="outline" size="sm" className="w-full h-8 text-xs">Message</Button>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop View: Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b">
              <tr>
                <th className="px-4 py-3 font-medium">Candidate</th>
                <th className="px-4 py-3 font-medium">Position</th>
                <th className="px-4 py-3 font-medium">Applied</th>
                <th className="px-4 py-3 font-medium">ATS Match</th>
                <th className="px-4 py-3 font-medium">Resume</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {applications.map(app => (
                <tr key={app.id} className="border-b last:border-0 hover:bg-muted/50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={app.avatarUrl} />
                        <AvatarFallback>{app.candidateName.substring(0, 2)}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{app.candidateName}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{app.position}</td>
                  <td className="px-4 py-3 text-muted-foreground">{new Date(app.appliedAt).toLocaleDateString()}</td>
                  <td className="px-4 py-3">
                    {app.atsScore ? (
                      <Badge variant="outline" className={app.atsScore >= 80 ? "text-green-600 bg-green-50 border-green-200" : "text-amber-600 bg-amber-50 border-amber-200"}>
                        {app.atsScore}%
                      </Badge>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {app.isAtsOptimized ? (
                      <PremiumBadge />
                    ) : (
                      <Badge variant="secondary" className="font-normal gap-1">
                        <FileText className="w-3 h-3" /> Original
                      </Badge>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant="outline">{app.status}</Badge>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger className="flex h-8 w-8 items-center justify-center rounded-md hover:bg-muted focus:outline-none">
                        <MoreHorizontal className="h-4 w-4" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>View Profile</DropdownMenuItem>
                        <DropdownMenuItem>Download Resume</DropdownMenuItem>
                        <DropdownMenuItem>Message Candidate</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
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

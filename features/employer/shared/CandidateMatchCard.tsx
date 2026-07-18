import React from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { UserPlus, Download, CheckCircle, XCircle, Sparkles } from "lucide-react";
import { PremiumBadge } from "@/components/shared/PremiumBadge";

export interface CandidateMatchCardProps {
  candidate: {
    id: string;
    name: string;
    avatarUrl?: string;
    role: string;
    experience: string;
    matchScore: number;
    atsScore?: number;
    skills: string[];
    missingSkills: string[];
    certifications?: string[];
    location?: string;
    availability?: string;
    isAtsOptimized?: boolean;
  };
  onAction?: (action: "profile" | "shortlist" | "invite" | "download") => void;
}

export function CandidateMatchCard({ candidate, onAction }: CandidateMatchCardProps) {
  const initials = candidate.name.split(" ").map(n => n[0]).join("").substring(0, 2);

  return (
    <Card className="flex flex-col h-full hover:shadow-md transition-shadow overflow-hidden border-primary/10">
      <div className="bg-gradient-to-r from-purple-500/10 via-transparent to-transparent p-4 border-b">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 border-2 border-background shadow-sm">
              <AvatarImage src={candidate.avatarUrl} alt={candidate.name} />
              <AvatarFallback className="bg-primary/5 text-primary text-lg">{initials}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-lg flex items-center gap-2">
                {candidate.name}
                {candidate.isAtsOptimized && <PremiumBadge />}
              </h3>
              <p className="text-sm text-muted-foreground">{candidate.role}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {candidate.experience} • {candidate.location || "Remote"} • {candidate.availability || "Available Now"}
              </p>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <Badge variant="default" className="bg-gradient-to-r from-purple-600 to-blue-600 border-none text-white gap-1 shadow-sm">
              <Sparkles className="w-3 h-3" />
              {candidate.matchScore}% Match
            </Badge>
            {candidate.atsScore && (
              <Badge variant="outline" className="text-xs">
                ATS Score: {candidate.atsScore}/100
              </Badge>
            )}
          </div>
        </div>
      </div>
      
      <CardContent className="p-4 flex-1 flex flex-col gap-4">
        <div>
          <h4 className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">Matching Skills</h4>
          <div className="flex flex-wrap gap-1.5">
            {candidate.skills.map(skill => (
              <Badge key={skill} variant="secondary" className="bg-green-50 text-green-700 hover:bg-green-100 border-green-200">
                <CheckCircle className="w-3 h-3 mr-1" /> {skill}
              </Badge>
            ))}
          </div>
        </div>

        {candidate.missingSkills.length > 0 && (
          <div>
            <h4 className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">Missing Skills</h4>
            <div className="flex flex-wrap gap-1.5">
              {candidate.missingSkills.map(skill => (
                <Badge key={skill} variant="outline" className="text-muted-foreground border-dashed">
                  <XCircle className="w-3 h-3 mr-1 opacity-50" /> {skill}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {candidate.certifications && candidate.certifications.length > 0 && (
          <div>
            <h4 className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">Certifications</h4>
            <div className="flex flex-wrap gap-1.5">
              {candidate.certifications.map(cert => (
                <Badge key={cert} variant="secondary" className="bg-primary/5 text-xs">
                  {cert}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter className="p-4 border-t bg-muted/20 gap-2 grid grid-cols-2 md:grid-cols-4">
        <Button variant="outline" size="sm" className="w-full text-xs" onClick={() => onAction?.('profile')}>
          View Profile
        </Button>
        <Button variant="outline" size="sm" className="w-full text-xs" onClick={() => onAction?.('download')}>
          <Download className="w-3.5 h-3.5 mr-1.5" /> Resume
        </Button>
        <Button variant="secondary" size="sm" className="w-full text-xs" onClick={() => onAction?.('invite')}>
          Invite
        </Button>
        <Button variant="default" size="sm" className="w-full text-xs" onClick={() => onAction?.('shortlist')}>
          <UserPlus className="w-3.5 h-3.5 mr-1.5" /> Shortlist
        </Button>
      </CardFooter>
    </Card>
  );
}

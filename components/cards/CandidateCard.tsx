import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export interface CandidateCardProps {
  name: string;
  role: string;
  match?: string;
  skills: string[];
  identityVerified?: boolean;
  resumeVerified?: boolean;
  atsScore?: number;
  resumeUrl?: string;
}

export function CandidateCard({ name, role, match, skills, identityVerified = true, resumeVerified = true, atsScore = 85, resumeUrl = "#" }: CandidateCardProps) {
  return (
    <Card className="shadow-sm border group hover:border-primary transition-all flex flex-col h-full">
      <CardContent className="p-6">
        <div className="flex items-start gap-4 mb-6">
          <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 border bg-muted flex items-center justify-center">
             <span className="text-xl font-bold text-muted-foreground">{name.charAt(0)}</span>
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-start">
              <h5 className="text-lg font-bold text-foreground">{name}</h5>
              {match && (
                <Badge variant="secondary" className="bg-secondary/20 hover:bg-secondary/20 text-secondary-foreground text-xs rounded">
                  {match} Match
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2 mt-1 mb-1">
              {identityVerified && (
                <Badge variant="outline" className="text-[10px] bg-green-50 text-green-700 border-green-200" title="Identity Verified">
                  ID Verified
                </Badge>
              )}
              {resumeVerified && (
                <Badge variant="outline" className="text-[10px] bg-blue-50 text-blue-700 border-blue-200" title="Resume Verified">
                  Resume Verified
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground">{role}</p>
            {atsScore && (
              <p className="text-xs font-semibold text-primary mt-1">ATS Score: {atsScore}%</p>
            )}
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mb-8">
          {skills.map((skill: string) => (
            <Badge key={skill} variant="outline" className="text-[10px] uppercase font-bold text-muted-foreground bg-muted/50 rounded">
              {skill}
            </Badge>
          ))}
        </div>
        <div className="mt-auto pt-4 flex flex-col gap-3">
          <div className="flex gap-3">
            <Button className="flex-1 h-9 rounded-xl">View Profile</Button>
            <Button variant="outline" className="px-4 h-9 rounded-xl">Message</Button>
          </div>
          <div className="flex gap-3">
            <Button variant="secondary" className="flex-1 h-9 rounded-xl text-xs" render={<a href={resumeUrl} target="_blank" rel="noopener noreferrer" />} nativeButton={false}>
              Preview Resume
            </Button>
            <Button variant="secondary" className="flex-1 h-9 rounded-xl text-xs" render={<a href={resumeUrl} download />} nativeButton={false}>
              Download Resume
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

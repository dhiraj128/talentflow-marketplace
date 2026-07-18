import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Mail, MapPin, Zap } from "lucide-react";
import { PremiumBadge } from "@/components/shared/PremiumBadge";

export interface CandidateCardProps {
  id: string;
  name: string;
  avatarUrl?: string;
  role: string;
  experience: string;
  matchScore: number;
  skills: string[];
  location?: string;
  isAtsOptimized?: boolean;
  onAction?: (action: "schedule" | "message" | "hire" | "reject") => void;
}

export function CandidateCard({
  name,
  avatarUrl,
  role,
  experience,
  matchScore,
  skills,
  location,
  isAtsOptimized,
  onAction
}: CandidateCardProps) {
  const initials = name.split(" ").map(n => n[0]).join("").substring(0, 2);

  return (
    <Card className="hover:border-primary/50 transition-colors bg-white/50 dark:bg-black/20 backdrop-blur-sm">
      <CardContent className="p-4 flex flex-col gap-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12 border shadow-sm">
              <AvatarImage src={avatarUrl} alt={name} />
              <AvatarFallback className="bg-primary/10 text-primary font-semibold">{initials}</AvatarFallback>
            </Avatar>
            <div>
              <h4 className="font-semibold text-base flex items-center gap-2">
                {name}
                {isAtsOptimized && <PremiumBadge />}
              </h4>
              <p className="text-sm text-muted-foreground">{role} • {experience}</p>
            </div>
          </div>
          <Badge variant="outline" className={
            matchScore >= 90 ? "bg-green-50 text-green-700 border-green-200" :
            matchScore >= 75 ? "bg-amber-50 text-amber-700 border-amber-200" :
            "bg-muted text-muted-foreground"
          }>
            {matchScore}% Match
          </Badge>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {location && (
            <Badge variant="secondary" className="font-normal bg-muted/50 text-xs">
              <MapPin className="w-3 h-3 mr-1" /> {location}
            </Badge>
          )}
          {skills.slice(0, 3).map(skill => (
            <Badge key={skill} variant="secondary" className="font-normal bg-primary/5 text-xs">
              {skill}
            </Badge>
          ))}
          {skills.length > 3 && (
            <Badge variant="secondary" className="font-normal bg-muted/50 text-xs">
              +{skills.length - 3} more
            </Badge>
          )}
        </div>

        <div className="grid grid-cols-2 gap-2 mt-1">
          <Button variant="outline" size="sm" className="w-full text-xs h-8" onClick={() => onAction?.('schedule')}>
            <Calendar className="w-3.5 h-3.5 mr-1.5" /> Schedule
          </Button>
          <Button variant="outline" size="sm" className="w-full text-xs h-8" onClick={() => onAction?.('message')}>
            <Mail className="w-3.5 h-3.5 mr-1.5" /> Message
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

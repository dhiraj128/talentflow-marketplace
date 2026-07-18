import React from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RatingStars } from "@/features/freelancer/shared/RatingStars";
import { VerificationBadge } from "@/features/freelancer/shared/VerificationBadge";
import { HourlyRateBadge } from "@/features/freelancer/shared/HourlyRateBadge";
import { MapPin, Briefcase, Zap, Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { motion } from "framer-motion";

export interface FreelancerCardProps {
  id: string;
  name: string;
  avatar?: string;
  isVerified: boolean;
  title: string;
  category: string;
  hourlyRate: number;
  rating: number;
  reviews: number;
  location: string;
  completedProjects: number;
  skills: string[];
  isAvailable: boolean;
  onSave?: () => void;
}

export function FreelancerCard({
  id,
  name,
  avatar,
  isVerified,
  title,
  category,
  hourlyRate,
  rating,
  reviews,
  location,
  completedProjects,
  skills,
  isAvailable,
  onSave
}: FreelancerCardProps) {
  return (
    <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.2 }}>
      <Card className="h-full flex flex-col hover:shadow-lg hover:border-purple-500/30 transition-all overflow-hidden group">
        <CardContent className="p-5 flex-1 flex flex-col gap-4 relative">
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute top-4 right-4 text-muted-foreground hover:text-rose-500 rounded-full"
            onClick={(e) => { e.preventDefault(); onSave?.(); }}
          >
            <Heart className="w-5 h-5" />
          </Button>

          <div className="flex items-start gap-4">
            <div className="relative">
              <Avatar className="w-16 h-16 border-2 border-background shadow-sm group-hover:border-purple-100 transition-colors">
                <AvatarImage src={avatar} alt={name} />
                <AvatarFallback>{name.substring(0, 2)}</AvatarFallback>
              </Avatar>
              {isAvailable && (
                <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-background rounded-full" title="Available now" />
              )}
            </div>
            
            <div className="pt-1 flex-1 pr-8">
              <div className="flex items-center gap-1.5">
                <Link href={`/find-freelancers/${id}`} className="font-bold text-lg hover:text-purple-600 transition-colors line-clamp-1">
                  {name}
                </Link>
                <VerificationBadge isVerified={isVerified} />
              </div>
              <p className="text-sm font-medium text-purple-600 line-clamp-1">{title}</p>
              <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1.5">
                <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {location}</span>
                <span className="flex items-center gap-1"><Briefcase className="w-3 h-3" /> {completedProjects} jobs</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between mt-1">
            <RatingStars rating={rating} count={reviews} />
            <HourlyRateBadge rate={hourlyRate} />
          </div>

          <div className="flex flex-wrap gap-1.5 mt-2">
            {skills.slice(0, 4).map(skill => (
              <Badge key={skill} variant="secondary" className="font-normal text-xs bg-muted/50 text-muted-foreground">
                {skill}
              </Badge>
            ))}
            {skills.length > 4 && (
              <Badge variant="secondary" className="font-normal text-xs bg-muted/50 text-muted-foreground">
                +{skills.length - 4}
              </Badge>
            )}
          </div>

        </CardContent>
        <CardFooter className="p-5 pt-0 mt-auto border-t">
          <div className="flex items-center gap-3 w-full pt-4">
            <Link href={`/find-freelancers/${id}`} className="flex-1">
              <Button variant="outline" className="w-full">View Profile</Button>
            </Link>
            <Link href={`/employer/interviews?hire=${id}`} className="flex-1">
              <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                <Zap className="w-4 h-4 mr-1.5" /> Hire
              </Button>
            </Link>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
}

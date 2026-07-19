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
    <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }} className="h-full">
      <Card className="h-full flex flex-col hover:shadow-xl hover:border-purple-500/30 transition-all overflow-hidden group">
        <CardContent className="p-5 flex-grow flex flex-col gap-4 relative">
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute top-4 right-4 text-muted-foreground hover:text-rose-500 rounded-full hover:bg-rose-50 transition-colors"
            onClick={(e) => { e.preventDefault(); onSave?.(); }}
          >
            <Heart className="w-5 h-5" />
          </Button>

          <div className="flex items-start gap-4">
            <div className="relative shrink-0">
              <Avatar className="w-16 h-16 border-2 border-background shadow-sm group-hover:border-purple-100 transition-colors">
                <AvatarImage src={avatar} alt={name} />
                <AvatarFallback>{name.substring(0, 2)}</AvatarFallback>
              </Avatar>
              {isAvailable && (
                <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-background rounded-full" title="Available now" />
              )}
            </div>
            
            <div className="pt-1 flex-grow pr-8 min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <Link href={`/find-freelancers/${id}`} className="font-bold text-[20px] leading-tight hover:text-purple-600 transition-colors line-clamp-2 break-words">
                  {name}
                </Link>
                <VerificationBadge isVerified={isVerified} />
              </div>
              <p className="text-[16px] font-medium text-purple-600 line-clamp-2 mt-1 break-words leading-tight">{title}</p>
              <div className="flex items-center gap-3 text-sm text-muted-foreground mt-2">
                <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> {location}</span>
                <span className="flex items-center gap-1.5"><Briefcase className="w-3.5 h-3.5" /> {completedProjects} jobs</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between mt-2 pt-2 border-t border-border/50">
            <RatingStars rating={rating} count={reviews} />
            <span className="font-bold text-[16px]">${hourlyRate}/hr</span>
          </div>

          <div className="flex flex-wrap gap-1.5 mt-2">
            {skills.slice(0, 6).map(skill => (
              <Badge key={skill} variant="secondary" className="font-normal text-xs bg-muted/50 text-muted-foreground">
                {skill}
              </Badge>
            ))}
            {skills.length > 6 && (
              <Badge variant="secondary" className="font-normal text-xs bg-muted/50 text-muted-foreground">
                +{skills.length - 6} more
              </Badge>
            )}
          </div>

        </CardContent>
        <CardFooter className="p-5 pt-0 mt-auto">
          <div className="flex items-center gap-3 w-full pt-4 border-t border-border/50">
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

import React from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { RatingStars } from "@/features/freelancer/shared/RatingStars";
import { MapPin, Heart, CheckCircle2 } from "lucide-react";
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
  successRate?: number;
  onSave?: () => void;
}

export function FreelancerCard({
  id,
  name,
  avatar,
  isVerified,
  title,
  hourlyRate,
  rating,
  reviews,
  location,
  completedProjects,
  skills,
  isAvailable,
  successRate = 98,
  onSave
}: FreelancerCardProps) {
  return (
    <motion.div 
      whileHover={{ y: -4 }} 
      transition={{ duration: 0.2 }} 
      className="h-[480px] w-full max-w-[360px] mx-auto"
    >
      <Card className="h-full w-full flex flex-col hover:shadow-xl hover:border-purple-500/30 transition-all overflow-hidden relative bg-white">
        
        {/* Absolute Favorite Button */}
        <Button 
          variant="ghost" 
          size="icon" 
          className="absolute top-4 right-4 text-muted-foreground hover:text-rose-500 rounded-full hover:bg-rose-50 transition-colors z-10"
          onClick={(e) => { e.preventDefault(); onSave?.(); }}
        >
          <Heart className="w-5 h-5" />
        </Button>

        {/* Card Body */}
        <CardContent className="p-6 flex-grow flex flex-col min-h-0">
          
          {/* Header section */}
          <div className="flex flex-col gap-3">
            <div className="relative shrink-0 w-14 h-14">
              <Avatar className="w-14 h-14 border border-border shadow-sm">
                <AvatarImage src={avatar} alt={name} loading="lazy" />
                <AvatarFallback>{name.substring(0, 2)}</AvatarFallback>
              </Avatar>
              {isAvailable && (
                <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full ring-1 ring-green-600/20" title="Online" />
              )}
            </div>
            
            <div className="flex flex-col min-w-0 pr-8">
              <div className="flex items-center gap-1.5">
                <Link href={`/find-freelancers/${id}`} className="font-bold text-[18px] text-foreground hover:text-purple-600 transition-colors truncate">
                  {name}
                </Link>
                {isVerified && (
                  <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                )}
              </div>
              <p className="text-[14px] text-muted-foreground line-clamp-2 mt-0.5 leading-snug h-[42px]">
                {title}
              </p>
            </div>
          </div>

          {/* Location */}
          <div className="flex items-center gap-1.5 text-[13px] text-muted-foreground mt-2 truncate">
            <MapPin className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">{location}</span>
          </div>

          {/* Rating & Price */}
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-border/50">
            <div className="flex items-center gap-1.5">
              <RatingStars rating={rating} count={0} />
              <span className="text-[13px] font-medium text-foreground">{rating.toFixed(1)}</span>
              <span className="text-[13px] text-muted-foreground">({reviews})</span>
            </div>
            <span className="font-bold text-[15px] text-foreground">${hourlyRate}/hr</span>
          </div>

          {/* Skills */}
          <div className="flex flex-wrap gap-1.5 mt-3">
            {skills.slice(0, 5).map(skill => (
              <span key={skill} className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-700 hover:bg-slate-200 transition-colors">
                {skill}
              </span>
            ))}
            {skills.length > 5 && (
              <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-1 text-[11px] font-medium text-slate-700">
                +{skills.length - 5}
              </span>
            )}
          </div>

          {/* Stats Row */}
          <div className="flex items-center gap-4 mt-auto pt-3 text-[13px]">
            <div className="flex flex-col">
              <span className="font-semibold text-foreground">{completedProjects}</span>
              <span className="text-muted-foreground text-[11px] uppercase tracking-wider">Projects</span>
            </div>
            <div className="w-px h-8 bg-border"></div>
            <div className="flex flex-col">
              <span className="font-semibold text-foreground">{successRate}%</span>
              <span className="text-muted-foreground text-[11px] uppercase tracking-wider">Success</span>
            </div>
          </div>

        </CardContent>

        {/* Footer */}
        <CardFooter className="p-5 pt-0 mt-auto">
          <div className="flex items-center gap-3 w-full pt-3 border-t border-border/50">
            <Link href={`/find-freelancers/${id}`} className="flex-1">
              <Button variant="outline" className="w-full h-[40px] rounded-[12px] font-medium text-[14px]">
                View Profile
              </Button>
            </Link>
            <Link href={`/employer/interviews?hire=${id}`} className="flex-1">
              <Button className="w-full h-[40px] rounded-[12px] bg-purple-600 hover:bg-purple-700 text-white font-medium text-[14px]">
                Hire
              </Button>
            </Link>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
}

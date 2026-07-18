import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { VerificationBadge } from "@/features/freelancer/shared/VerificationBadge";
import { HourlyRateBadge } from "@/features/freelancer/shared/HourlyRateBadge";
import { RatingStars } from "@/features/freelancer/shared/RatingStars";
import { AvailabilityStatus } from "./AvailabilityStatus";
import { FreelancerStats } from "./FreelancerStats";
import { SkillsWidget } from "./SkillsWidget";
import { PortfolioGallery } from "./PortfolioGallery";
import { ReviewsWidget } from "./ReviewsWidget";
import { HireButton } from "@/features/freelancer/shared/HireButton";
import { Button } from "@/components/ui/button";
import { Heart, MapPin, Share2 } from "lucide-react";

interface ServiceProfileProps {
  freelancer: any; // We'll pass the mock freelancer object here
}

export function ServiceProfile({ freelancer }: ServiceProfileProps) {
  if (!freelancer) return null;

  // Mock Portfolio Items
  const portfolioItems = [
    { title: "E-Commerce Dashboard", link: "https://github.com/example/ecommerce", type: "github" as const },
    { title: "SaaS Landing Page", link: "https://dribbble.com/example/saas", type: "image" as const },
    { title: "Mobile App UI", link: "https://behance.net/example/app", type: "link" as const },
  ];

  // Mock Reviews
  const reviews = [
    { id: "r1", author: "TechCorp Inc.", rating: 5, date: "2 weeks ago", comment: "Excellent work, delivered ahead of schedule with perfect code quality." },
    { id: "r2", author: "DesignFlow Agency", rating: 4.5, date: "1 month ago", comment: "Great communication and very skilled in React." },
  ];

  return (
    <div className="space-y-8">
      
      {/* Hero Header */}
      <div className="bg-background rounded-2xl shadow-sm border p-6 md:p-8 space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start gap-6">
          <div className="flex items-start gap-6">
            <Avatar className="w-24 h-24 border-4 border-background shadow-md">
              <AvatarImage src={freelancer.avatar} alt={freelancer.name} />
              <AvatarFallback className="text-2xl">{freelancer.name.substring(0, 2)}</AvatarFallback>
            </Avatar>
            <div className="space-y-2 pt-1">
              <div className="flex items-center gap-2">
                <h1 className="text-3xl font-bold tracking-tight">{freelancer.name}</h1>
                <VerificationBadge isVerified={freelancer.isVerified} />
              </div>
              <h2 className="text-xl text-purple-600 font-medium">{freelancer.title}</h2>
              <div className="flex items-center gap-4 text-sm text-muted-foreground pt-1">
                <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> {freelancer.location}</span>
                <RatingStars rating={freelancer.rating} count={freelancer.reviews} />
              </div>
            </div>
          </div>
          
          <div className="w-full md:w-auto flex flex-col items-end gap-4">
            <HourlyRateBadge rate={freelancer.hourlyRate} className="text-xl py-2 px-4 shadow-sm" />
            <div className="flex items-center gap-2 w-full md:w-auto">
              <Button variant="outline" size="icon" className="shrink-0 rounded-full"><Heart className="w-4 h-4" /></Button>
              <Button variant="outline" size="icon" className="shrink-0 rounded-full"><Share2 className="w-4 h-4" /></Button>
              <HireButton className="w-full md:w-auto rounded-full px-8" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          <div className="space-y-4">
            <h3 className="font-semibold text-lg border-b pb-2">About</h3>
            <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
              Hi, I'm {freelancer.name}, a professional {freelancer.title} with over 5 years of experience in {freelancer.category}. 
              I specialize in creating high-quality, scalable solutions tailored to your business needs. 
              My goal is to deliver exceptional results that exceed your expectations. Let's build something amazing together!
            </p>
          </div>

          <PortfolioGallery items={portfolioItems} />
          
          <ReviewsWidget 
            reviews={reviews} 
            averageRating={freelancer.rating} 
            totalReviews={freelancer.reviews} 
          />
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          <div className="bg-background rounded-2xl shadow-sm border p-6 space-y-6 sticky top-24">
            <AvailabilityStatus status="Full-time (30+ hrs/week)" isAvailable={freelancer.isAvailable} />
            <FreelancerStats completedProjects={freelancer.completedProjects} />
            <SkillsWidget skills={freelancer.skills} />
            
            {/* Mobile Sticky Hire Button (only visible on mobile, fixed to bottom) */}
            <div className="md:hidden fixed bottom-4 left-4 right-4 z-50">
              <HireButton className="w-full shadow-2xl h-14 text-lg rounded-xl" />
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}

"use client";

import React from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatsGrid } from "@/components/shared/StatsGrid";
import { MetricCard } from "@/components/shared/MetricCard";
import { Star, ThumbsUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function ReviewsPage() {
  return (
    <div className="max-w-7xl mx-auto p-8 space-y-8">
      <PageHeader 
        title="Reviews & Feedback" 
        description="See what clients are saying about your work."
      />

      <StatsGrid columns={3}>
        <MetricCard title="Overall Rating" value="4.9" icon={<Star className="w-4 h-4 text-yellow-500 fill-current" />} description="Based on 42 reviews" />
        <MetricCard title="Job Success Score" value="98%" icon={<ThumbsUp className="w-4 h-4" />} trend="up" trendValue="+2%" />
        <MetricCard title="Total Reviews" value="42" icon={<Star className="w-4 h-4" />} />
      </StatsGrid>

      <div className="space-y-6">
        <h3 className="text-xl font-semibold">Recent Reviews</h3>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h4 className="font-semibold text-lg">E-Commerce Website Redesign</h4>
                <p className="text-sm text-muted-foreground">Client: TechNova Ltd. • Completed 2 weeks ago</p>
              </div>
              <div className="flex text-yellow-500">
                {[1,2,3,4,5].map(i => <Star key={i} className="w-4 h-4 fill-current" />)}
              </div>
            </div>
            <p className="text-sm">"Excellent work! Delivered ahead of schedule and the quality of the React code was top-notch. Will definitely hire again for future projects."</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h4 className="font-semibold text-lg">Mobile App UI Design</h4>
                <p className="text-sm text-muted-foreground">Client: StartupX • Completed 1 month ago</p>
              </div>
              <div className="flex text-yellow-500">
                {[1,2,3,4,5].map(i => <Star key={i} className="w-4 h-4 fill-current" />)}
              </div>
            </div>
            <p className="text-sm">"Very responsive and talented designer. The Figma files were perfectly organized and ready for our developers. Highly recommended!"</p>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}

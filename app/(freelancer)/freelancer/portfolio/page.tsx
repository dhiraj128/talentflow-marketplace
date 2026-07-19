"use client";

import React, { useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const portfolioItems = [
  { id: 1, title: "Fintech Dashboard UI", category: "UI/UX Design", image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80" },
  { id: 2, title: "E-Commerce Mobile App", category: "Mobile Dev", image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&q=80" },
  { id: 3, title: "SaaS Landing Page", category: "Web Development", image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80" },
  { id: 4, title: "Health & Fitness App", category: "UI/UX Design", image: "https://images.unsplash.com/photo-1526628953301-3e589a6a8b74?w=800&q=80" },
];

export default function PortfolioPage() {
  return (
    <div className="max-w-7xl mx-auto p-8 space-y-8">
      <PageHeader 
        title="Portfolio" 
        description="Showcase your best work to potential clients."
        actionLabel="Add Project"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {portfolioItems.map((item) => (
          <Card key={item.id} className="overflow-hidden group cursor-pointer border-0 shadow-sm hover:shadow-md transition-shadow">
            <div className="relative aspect-video overflow-hidden bg-muted">
              <img 
                src={item.image} 
                alt={item.title} 
                className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <CardContent className="p-4">
              <h3 className="font-semibold text-lg line-clamp-1 group-hover:text-primary transition-colors">{item.title}</h3>
              <p className="text-sm text-muted-foreground mt-1">{item.category}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

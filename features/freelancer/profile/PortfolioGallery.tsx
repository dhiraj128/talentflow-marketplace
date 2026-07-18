"use client";

import React from "react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { ExternalLink, Image as ImageIcon } from "lucide-react";

interface PortfolioGalleryProps {
  items: { title: string; link: string; type: "image" | "link" | "github" }[];
}

export function PortfolioGallery({ items }: PortfolioGalleryProps) {
  if (!items || items.length === 0) return null;

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-lg border-b pb-2">Portfolio</h3>
      
      {/* Swipeable Gallery for Mobile, Grid for Desktop */}
      <ScrollArea className="w-full whitespace-nowrap -mx-4 px-4 sm:mx-0 sm:px-0">
        <div className="flex w-max sm:w-full sm:grid sm:grid-cols-2 md:grid-cols-3 gap-4 pb-4">
          {items.map((item, idx) => (
            <Card key={idx} className="w-[280px] sm:w-auto shrink-0 overflow-hidden group border hover:border-purple-500/50 hover:shadow-md transition-all cursor-pointer">
              <div className="h-32 bg-muted/50 flex items-center justify-center relative group-hover:bg-purple-50/50 transition-colors">
                <ImageIcon className="w-8 h-8 text-muted-foreground/50 group-hover:text-purple-300 transition-colors" />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <ExternalLink className="w-6 h-6 text-white" />
                </div>
              </div>
              <CardContent className="p-4">
                <h4 className="font-semibold text-sm truncate">{item.title}</h4>
                <a href={item.link} target="_blank" rel="noreferrer" className="text-xs text-blue-600 hover:underline truncate block mt-1">
                  {item.link}
                </a>
              </CardContent>
            </Card>
          ))}
        </div>
        <ScrollBar orientation="horizontal" className="sm:hidden invisible" />
      </ScrollArea>
    </div>
  );
}

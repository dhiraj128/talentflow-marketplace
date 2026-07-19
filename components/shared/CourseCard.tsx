 
"use client";
import React from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, Users, Clock } from "lucide-react";

export interface CourseCardProps {
  title: string;
  instructor: string;
  rating: number;
  enrolled: number;
  duration: string;
  price: string;
  image?: string;
}

export function CourseCard({ title, instructor, rating, enrolled, duration, price, image }: CourseCardProps) {
  return (
    <Card className="overflow-hidden hover:border-primary/50 transition-colors flex flex-col">
      <div className="aspect-video w-full bg-muted relative">
        {image ? (
          <img src={image} alt={title} className="object-cover w-full h-full" />
        ) : (
          <div className="flex items-center justify-center w-full h-full bg-secondary text-secondary-foreground font-semibold">
            Course Preview
          </div>
        )}
      </div>
      <CardContent className="p-4 flex-1">
        <h3 className="font-semibold line-clamp-2 hover:text-primary cursor-pointer">{title}</h3>
        <p className="text-sm text-muted-foreground mt-1">{instructor}</p>
        <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-1 text-amber-500 font-medium">
            <Star className="w-3.5 h-3.5 fill-current" /> {rating}
          </div>
          <div className="flex items-center gap-1">
            <Users className="w-3.5 h-3.5" /> {enrolled}
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" /> {duration}
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between items-center border-t mt-4 border-t-muted pt-4">
        <span className="font-bold text-lg">{price}</span>
        <Button size="sm">Enroll Now</Button>
      </CardFooter>
    </Card>
  );
}

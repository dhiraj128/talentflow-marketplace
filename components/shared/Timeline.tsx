"use client";
import React from "react";
import { cn } from "@/lib/utils";
import { CheckCircle2, Circle, Clock } from "lucide-react";

export interface TimelineItem {
  id?: string | number;
  title: string;
  description?: string;
  date?: string;
  status: "completed" | "current" | "upcoming" | "error" | string;
  [key: string]: any;
}

interface TimelineProps {
  items: TimelineItem[];
  className?: string;
}

export function Timeline({ items, className }: TimelineProps) {
  return (
    <div className={cn("space-y-4", className)}>
      {items.map((item, index) => (
        <div key={item.id || index} className="relative pl-8 pb-4 last:pb-0">
          {index !== items.length - 1 && (
            <div className="absolute left-[11px] top-6 bottom-0 w-px bg-border" />
          )}
          <div className="absolute left-0 top-1">
            {item.status === "completed" && <CheckCircle2 className="w-6 h-6 text-primary" />}
            {item.status === "current" && <Clock className="w-6 h-6 text-amber-500" />}
            {item.status === "upcoming" && <Circle className="w-6 h-6 text-muted-foreground" />}
          </div>
          <div>
            <h4 className={cn("font-medium", item.status === "upcoming" ? "text-muted-foreground" : "")}>
              {item.title}
            </h4>
            {item.description && <p className="text-sm text-muted-foreground mt-0.5">{item.description}</p>}
            {item.date && <p className="text-xs text-muted-foreground mt-1">{item.date}</p>}
          </div>
        </div>
      ))}
    </div>
  );
}

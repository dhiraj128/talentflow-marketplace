"use client";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

export interface ActivityItem {
  id: string;
  user: { name: string; avatar?: string };
  action: string;
  target?: string;
  time: string;
  icon?: React.ReactNode;
}

interface ActivityFeedProps {
  items: ActivityItem[];
  className?: string;
}

export function ActivityFeed({ items, className }: ActivityFeedProps) {
  return (
    <div className={cn("space-y-6", className)}>
      {items.map((item) => (
        <div key={item.id} className="flex gap-4">
          <Avatar className="h-9 w-9">
            <AvatarImage src={item.user.avatar} alt={item.user.name} />
            <AvatarFallback>{item.user.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-1">
            <p className="text-sm leading-none">
              <span className="font-medium">{item.user.name}</span> {item.action} <span className="font-medium">{item.target}</span>
            </p>
            <p className="text-xs text-muted-foreground">{item.time}</p>
          </div>
          {item.icon && <div className="text-muted-foreground">{item.icon}</div>}
        </div>
      ))}
    </div>
  );
}

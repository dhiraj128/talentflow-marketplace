"use client";
import React from "react";
import { cn } from "@/lib/utils";

interface StatsGridProps {
  children?: React.ReactNode;
  columns?: 2 | 3 | 4;
  className?: string;
  stats?: any[];
  [key: string]: any;
}

export function StatsGrid({ children, columns = 4, className, stats, ...rest }: StatsGridProps) {
  const gridClass = {
    2: "md:grid-cols-2",
    3: "md:grid-cols-3",
    4: "md:grid-cols-2 lg:grid-cols-4",
  }[columns];

  return (
    <div className={cn(`grid gap-4 grid-cols-1 ${gridClass}`, className)} {...rest}>
      {stats ? stats.map((stat, i) => (
        <div key={i} className="p-6 border rounded-lg bg-card">
          <div className="flex items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium">{stat.label || stat.title}</h3>
            {stat.icon && <div className="text-muted-foreground w-4 h-4">{stat.icon}</div>}
          </div>
          <div className="text-2xl font-bold">{stat.value}</div>
          {(stat.description || stat.trend) && <p className="text-xs text-muted-foreground mt-1">{stat.description || stat.trend}</p>}
        </div>
      )) : children}
    </div>
  );
}

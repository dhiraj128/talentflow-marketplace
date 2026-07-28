import React from "react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface CategoryTabsProps {
  categories: string[];
  activeCategory: string;
  onSelect: (category: string) => void;
}

export function CategoryTabs({ categories, activeCategory, onSelect }: CategoryTabsProps) {
  return (
    <div className="w-full max-w-full min-w-0 overflow-x-auto whitespace-nowrap py-2 px-1 flex items-center gap-2">
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => onSelect(category)}
          className={cn(
            "px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 border shrink-0",
            activeCategory === category 
              ? "bg-purple-600 text-white border-purple-600 shadow-md shadow-purple-600/20" 
              : "bg-background hover:bg-muted text-muted-foreground border-border hover:text-foreground"
          )}
        >
          {category}
        </button>
      ))}
    </div>
  );
}

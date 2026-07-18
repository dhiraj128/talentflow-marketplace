"use client";

import { cn } from "@/lib/utils";

interface CategoryTabsProps {
  categories: string[];
  activeCategory: string;
  onSelect: (category: string) => void;
}

export function CategoryTabs({ categories, activeCategory, onSelect }: CategoryTabsProps) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-hide">
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => onSelect(category)}
          className={cn(
            "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors",
            activeCategory === category
              ? "bg-primary text-primary-foreground shadow-sm"
              : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
          )}
        >
          {category}
        </button>
      ))}
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { History, X } from "lucide-react";

interface RecentSearchesProps {
  onSelect: (term: string) => void;
}

const MAX_RECENT = 5;

export function useRecentSearches() {
  const { user } = useAuth();
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem("talentflow_recent_searches");
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch (e) {
          return [];
        }
      }
    }
    return [];
  });

  const addSearch = (term: string) => {
    if (!term.trim() || !user) return;
    
    setRecentSearches(prev => {
      const filtered = prev.filter(s => s.toLowerCase() !== term.toLowerCase());
      const updated = [term, ...filtered].slice(0, MAX_RECENT);
      localStorage.setItem("talentflow_recent_searches", JSON.stringify(updated));
      return updated;
    });
  };

  const removeSearch = (term: string) => {
    setRecentSearches(prev => {
      const updated = prev.filter(s => s !== term);
      localStorage.setItem("talentflow_recent_searches", JSON.stringify(updated));
      return updated;
    });
  };

  return { recentSearches, addSearch, removeSearch };
}

import React from "react";
export const RecentSearches = React.memo(function RecentSearches({ onSelect }: RecentSearchesProps) {
  const { user } = useAuth();
  const { recentSearches, removeSearch } = useRecentSearches();

  if (!user || recentSearches.length === 0) return null;

  return (
    <div className="py-2">
      <div className="px-2 pb-2 text-xs font-semibold text-muted-foreground">
        Recent Searches
      </div>
      <div className="flex flex-col">
        {recentSearches.map((term) => (
          <div
            key={term}
            className="flex items-center justify-between px-2 py-1.5 text-sm rounded-sm hover:bg-accent hover:text-accent-foreground cursor-pointer group"
          >
            <div className="flex items-center flex-1" onClick={() => onSelect(term)}>
              <History className="mr-2 h-4 w-4 text-muted-foreground" />
              {term}
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                removeSearch(term);
              }}
              className="opacity-0 group-hover:opacity-100 p-1 hover:bg-muted rounded-full transition-opacity"
              aria-label="Remove recent search"
            >
              <X className="h-3 w-3 text-muted-foreground" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
});

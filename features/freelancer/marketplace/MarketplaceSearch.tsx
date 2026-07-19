import React from "react";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MarketplaceSearchProps {
  value: string;
  onChange: (val: string) => void;
  onSearch: () => void;
  onClear?: () => void;
}

export function MarketplaceSearch({ value, onChange, onSearch, onClear }: MarketplaceSearchProps) {
  return (
    <div className="relative flex flex-col sm:flex-row w-full max-w-3xl mx-auto shadow-lg bg-white rounded-xl overflow-hidden border border-border/50 transition-all focus-within:ring-2 focus-within:ring-purple-500/50">
      <div className="relative flex-1 flex items-center">
        <Search className="absolute left-5 text-muted-foreground w-6 h-6" />
        <Input 
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onSearch()}
          placeholder="Search freelancers by skill, title, company or keyword..." 
          className="h-14 sm:h-16 w-full pl-14 pr-12 border-0 focus-visible:ring-0 text-base md:text-lg bg-transparent rounded-none text-slate-900"
        />
        {value && (
          <button 
            onClick={() => {
              onChange("");
              onClear?.();
            }}
            className="absolute right-4 p-1 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>
      <Button 
        onClick={onSearch}
        className="h-14 sm:h-16 rounded-none bg-purple-600 hover:bg-purple-700 w-full sm:w-[160px] text-base md:text-lg font-medium text-white transition-colors"
      >
        Search
      </Button>
    </div>
  );
}

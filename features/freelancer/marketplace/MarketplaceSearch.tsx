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
    <div className="relative flex flex-col md:flex-row w-full max-w-3xl mx-auto gap-4 md:gap-0 md:bg-white md:rounded-xl md:shadow-lg md:border md:border-border/50 md:focus-within:ring-2 md:focus-within:ring-purple-500/50 transition-all md:overflow-hidden">
      
      {/* Input Section */}
      <div className="relative flex-1 flex items-center bg-white rounded-xl md:rounded-none shadow-lg md:shadow-none border border-border/50 md:border-0 h-[56px] focus-within:ring-2 focus-within:ring-purple-500/50 md:focus-within:ring-0 overflow-hidden md:overflow-visible">
        <Search className="absolute left-5 text-muted-foreground w-6 h-6 flex-shrink-0" />
        <Input 
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onSearch()}
          placeholder="Search freelancers by skill, title, company or keyword..." 
          className="h-full w-full pl-14 pr-12 border-0 focus-visible:ring-0 text-base bg-transparent text-slate-900 rounded-none shadow-none"
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

      {/* Button Section */}
      <Button 
        onClick={onSearch}
        className="h-[56px] w-full md:w-[150px] rounded-xl md:rounded-none bg-purple-600 hover:bg-purple-700 text-base font-medium text-white transition-colors shadow-lg md:shadow-none flex-shrink-0"
      >
        Search
      </Button>
    </div>
  );
}

import React from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MarketplaceSearchProps {
  value: string;
  onChange: (val: string) => void;
  onSearch: () => void;
}

export function MarketplaceSearch({ value, onChange, onSearch }: MarketplaceSearchProps) {
  return (
    <div className="relative flex-1 flex w-full max-w-2xl mx-auto shadow-sm">
      <div className="relative flex-1">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <Input 
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onSearch()}
          placeholder="Search by name, skill, or keyword..." 
          className="py-6 pl-12 rounded-r-none focus-visible:ring-purple-500 border-r-0 text-base"
        />
      </div>
      <Button 
        onClick={onSearch}
        className="h-auto rounded-l-none bg-purple-600 hover:bg-purple-700 px-8 text-base font-medium text-white"
      >
        Search
      </Button>
    </div>
  );
}

import React from "react";
import { Button } from "@/components/ui/button";
import { UserX } from "lucide-react";

interface EmptyMarketplaceStateProps {
  onClearFilters: () => void;
}

export function EmptyMarketplaceState({ onClearFilters }: EmptyMarketplaceStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-24 px-4 text-center bg-white rounded-2xl border border-border/50 shadow-sm">
      <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6">
        <UserX className="w-12 h-12 text-slate-300" />
      </div>
      <h3 className="text-2xl font-bold text-slate-900 mb-2">No freelancers found</h3>
      <p className="text-slate-500 max-w-md mb-8">
        We couldn't find any professionals matching your exact criteria. Try adjusting your filters, widening your search, or exploring other categories.
      </p>
      <Button 
        onClick={onClearFilters} 
        variant="outline" 
        className="px-8 h-12 border-purple-200 text-purple-700 hover:bg-purple-50 rounded-xl"
      >
        Reset Filters
      </Button>
    </div>
  );
}

import React from "react";
import { UserX } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyMarketplaceStateProps {
  onClearFilters: () => void;
}

export function EmptyMarketplaceState({ onClearFilters }: EmptyMarketplaceStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center px-4 border border-dashed rounded-xl bg-muted/10">
      <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
        <UserX className="w-8 h-8 text-muted-foreground" />
      </div>
      <h3 className="text-xl font-bold mb-2">No Freelancers Found</h3>
      <p className="text-muted-foreground mb-6 max-w-md">
        We couldn't find any freelancers matching your current search and filters. Try adjusting your criteria.
      </p>
      <Button onClick={onClearFilters} variant="outline" className="border-purple-200 hover:bg-purple-50 hover:text-purple-700">
        Clear All Filters
      </Button>
    </div>
  );
}

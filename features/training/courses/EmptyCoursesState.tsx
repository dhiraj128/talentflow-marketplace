import { SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyCoursesStateProps {
  onClearFilters: () => void;
}

export function EmptyCoursesState({ onClearFilters }: EmptyCoursesStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-6">
        <SearchX className="w-10 h-10 text-muted-foreground" />
      </div>
      <h3 className="text-2xl font-bold mb-2">No courses found</h3>
      <p className="text-muted-foreground max-w-md mb-8">
        We couldn't find any courses matching your current search criteria. Try adjusting your filters or search terms.
      </p>
      <Button onClick={onClearFilters} variant="outline" className="min-w-[150px]">
        Clear Filters
      </Button>
    </div>
  );
}

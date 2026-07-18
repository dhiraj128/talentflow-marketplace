import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Check } from "lucide-react";

interface LessonNavigationProps {
  hasPrev: boolean;
  hasNext: boolean;
  onPrev: () => void;
  onNext: () => void;
}

export function LessonNavigation({ hasPrev, hasNext, onPrev, onNext }: LessonNavigationProps) {
  return (
    <div className="flex items-center justify-between p-4 lg:px-8 max-w-7xl mx-auto">
      <Button 
        variant="outline" 
        onClick={onPrev} 
        disabled={!hasPrev}
        className="min-w-[120px]"
      >
        <ChevronLeft className="w-4 h-4 mr-2" /> Previous
      </Button>
      
      <div className="flex gap-3">
        <Button variant="outline" className="hidden sm:flex gap-2">
          <Check className="w-4 h-4 text-green-500" /> Mark Complete
        </Button>
        <Button 
          onClick={onNext} 
          disabled={!hasNext}
          className="min-w-[120px] bg-blue-600 hover:bg-blue-700"
        >
          Next <ChevronRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}

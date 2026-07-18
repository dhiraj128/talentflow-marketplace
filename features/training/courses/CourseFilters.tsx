"use client";

import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface CourseFiltersProps {
  filters: {
    difficulty: string[];
    price: string;
    rating: string;
  };
  setFilters: (filters: any) => void;
  className?: string;
}

export function CourseFilters({ filters, setFilters, className = "" }: CourseFiltersProps) {
  const handleDifficulty = (level: string, checked: boolean) => {
    if (checked) {
      setFilters({ ...filters, difficulty: [...filters.difficulty, level] });
    } else {
      setFilters({ ...filters, difficulty: filters.difficulty.filter((d) => d !== level) });
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="space-y-3">
        <h4 className="font-semibold text-sm">Level</h4>
        <div className="space-y-2.5">
          {["Beginner", "Intermediate", "Advanced"].map((level) => (
            <div key={level} className="flex items-center space-x-2">
              <Checkbox 
                id={`lvl-${level}`} 
                checked={filters.difficulty.includes(level)}
                onCheckedChange={(checked) => handleDifficulty(level, checked as boolean)}
              />
              <Label htmlFor={`lvl-${level}`} className="font-normal">{level}</Label>
            </div>
          ))}
        </div>
      </div>
      
      <div className="space-y-3">
        <h4 className="font-semibold text-sm">Price</h4>
        <RadioGroup value={filters.price} onValueChange={(val) => setFilters({ ...filters, price: val })}>
          <div className="flex items-center space-x-2 mb-2">
            <RadioGroupItem value="all" id="price-all" />
            <Label htmlFor="price-all" className="font-normal">All Courses</Label>
          </div>
          <div className="flex items-center space-x-2 mb-2">
            <RadioGroupItem value="free" id="price-free" />
            <Label htmlFor="price-free" className="font-normal">Free Courses</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="paid" id="price-paid" />
            <Label htmlFor="price-paid" className="font-normal">Paid Courses</Label>
          </div>
        </RadioGroup>
      </div>

      <div className="space-y-3">
        <h4 className="font-semibold text-sm">Minimum Rating</h4>
        <RadioGroup value={filters.rating} onValueChange={(val) => setFilters({ ...filters, rating: val })}>
          {[4.5, 4.0, 3.5, 3.0].map((rating) => (
            <div key={rating} className="flex items-center space-x-2 mb-2">
              <RadioGroupItem value={rating.toString()} id={`rating-${rating}`} />
              <Label htmlFor={`rating-${rating}`} className="font-normal">{rating} & up</Label>
            </div>
          ))}
        </RadioGroup>
      </div>
    </div>
  );
}

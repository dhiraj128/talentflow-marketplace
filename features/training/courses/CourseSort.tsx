import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowUpDown } from "lucide-react";

interface CourseSortProps {
  value: string;
  onChange: (value: string) => void;
}

export function CourseSort({ value, onChange }: CourseSortProps) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-sm font-medium text-muted-foreground hidden sm:inline-flex items-center gap-1">
        <ArrowUpDown className="w-4 h-4" /> Sort by:
      </span>
      <Select value={value} onValueChange={(val) => onChange(val as string)}>
        <SelectTrigger className="w-[180px] bg-background">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="recommended">AI Recommended</SelectItem>
          <SelectItem value="popular">Most Popular</SelectItem>
          <SelectItem value="rating">Highest Rated</SelectItem>
          <SelectItem value="newest">Newest</SelectItem>
          <SelectItem value="duration">Shortest Duration</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}

"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CourseSearch() {
  const [query, setQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Implementation will connect to filtering context
  };

  return (
    <form onSubmit={handleSearch} className="relative w-full max-w-lg">
      <div className="relative flex items-center">
        <Search className="absolute left-3 w-4 h-4 text-muted-foreground" />
        <Input 
          type="text" 
          placeholder="Search courses, skills, or instructors..." 
          className="pl-9 pr-24 h-12 bg-background border-muted"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <Button type="submit" size="sm" className="absolute right-1.5 h-9 bg-blue-600 hover:bg-blue-700">
          Search
        </Button>
      </div>
    </form>
  );
}

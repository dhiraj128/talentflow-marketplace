import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";
import React from "react";

interface FilterDrawerProps {
  children: React.ReactNode;
  triggerLabel?: string;
}

export function FilterDrawer({ children, triggerLabel = "Filters" }: FilterDrawerProps) {
  return (
    <Sheet>
      <SheetTrigger>
        <div className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 gap-2">
          <Filter className="w-4 h-4" /> {triggerLabel}
        </div>
      </SheetTrigger>
      <SheetContent side="bottom" className="h-[80vh] rounded-t-2xl sm:h-auto sm:max-h-[90vh] sm:side-right sm:rounded-l-2xl sm:rounded-t-none">
        <SheetHeader className="mb-6">
          <SheetTitle>{triggerLabel}</SheetTitle>
        </SheetHeader>
        {children}
      </SheetContent>
    </Sheet>
  );
}

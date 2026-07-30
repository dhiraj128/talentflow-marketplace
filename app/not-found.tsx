"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FileQuestion, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-300">
      <div className="bg-muted p-4 rounded-full mb-4">
        <FileQuestion className="w-12 h-12 text-muted-foreground" />
      </div>
      <h1 className="text-4xl font-extrabold tracking-tight text-foreground mb-2">404 - Page Not Found</h1>
      <p className="text-muted-foreground mb-6 max-w-md">
        The page or resource you are looking for doesn't exist, has been moved, or is temporarily unavailable.
      </p>
      <div className="flex items-center gap-3">
        <Link href="/">
          <Button variant="default" className="flex items-center gap-2">
            <Home className="h-4 w-4" /> Go to Marketplace Home
          </Button>
        </Link>
      </div>
    </div>
  );
}

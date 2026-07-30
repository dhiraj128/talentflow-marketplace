"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw, Home } from "lucide-react";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string; requestId?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("ErrorBoundary caught:", error);
    if (error?.message?.includes("Base UI error") || error?.message?.includes("Positioner") || error?.message?.includes("anchor")) {
      console.warn("Auto-recovering transient UI unmount error...");
      const timer = setTimeout(() => reset(), 50);
      return () => clearTimeout(timer);
    }
  }, [error, reset]);

  const requestId = error?.requestId || error?.digest;

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-300">
      <div className="bg-destructive/10 p-4 rounded-full mb-4">
        <AlertCircle className="w-10 h-10 text-destructive" />
      </div>
      <h2 className="text-2xl font-bold text-foreground mb-2">Something went wrong</h2>
      <p className="text-sm text-muted-foreground mb-4 max-w-md">
        We encountered an unexpected error while processing your request. Please try again or return to the homepage.
      </p>
      {requestId && (
        <div className="mb-6 px-3 py-1.5 bg-muted rounded-md border text-xs text-muted-foreground font-mono">
          Request ID: <span className="font-semibold text-foreground">{requestId}</span>
        </div>
      )}
      <div className="flex items-center gap-3">
        <Button onClick={() => reset()} variant="default" className="flex items-center gap-2">
          <RefreshCw className="h-4 w-4" /> Try Again
        </Button>
        <Button onClick={() => (window.location.href = "/")} variant="outline" className="flex items-center gap-2">
          <Home className="h-4 w-4" /> Return Home
        </Button>
      </div>
    </div>
  );
}

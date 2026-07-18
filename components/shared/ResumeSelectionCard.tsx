import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, CheckCircle2, ChevronRight, Download, Edit } from "lucide-react";
import { PremiumBadge } from "./PremiumBadge";
import { cn } from "@/lib/utils";

interface ResumeSelectionCardProps {
  type: "original" | "ats";
  title: string;
  date: string;
  score?: number;
  selected?: boolean;
  onSelect?: () => void;
  isPremium?: boolean;
  hasAccess?: boolean;
  onUpgrade?: () => void;
  onPreview?: () => void;
}

export function ResumeSelectionCard({
  type,
  title,
  date,
  score,
  selected,
  onSelect,
  isPremium = false,
  hasAccess = true,
  onUpgrade,
  onPreview,
}: ResumeSelectionCardProps) {
  const isAts = type === "ats";

  return (
    <Card 
      className={cn(
        "relative overflow-hidden transition-all duration-200 border-2",
        selected ? (isAts ? "border-amber-400 bg-amber-50/30 dark:bg-amber-950/20" : "border-primary bg-primary/5") : "border-border hover:border-primary/50 cursor-pointer"
      )}
      onClick={() => {
        if (hasAccess && onSelect) onSelect();
      }}
    >
      <div className="p-4 flex flex-col gap-3">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center shrink-0",
              isAts ? "bg-amber-100 text-amber-600 dark:bg-amber-900/30" : "bg-muted text-muted-foreground"
            )}>
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold">{title}</h4>
              <p className="text-xs text-muted-foreground">Updated: {date}</p>
            </div>
          </div>
          
          <div className="flex flex-col items-end gap-2">
            {isPremium ? <PremiumBadge /> : <PremiumBadge variant="free" />}
            {selected && (
              <Badge variant="secondary" className="bg-primary text-primary-foreground border-transparent px-2 py-0">
                <CheckCircle2 className="w-3 h-3 mr-1" />
                Selected
              </Badge>
            )}
          </div>
        </div>

        {/* Content Details */}
        <div className="grid grid-cols-2 gap-2 mt-2">
          {score !== undefined && (
            <div className="bg-background rounded border px-3 py-2 text-sm">
              <span className="text-muted-foreground block text-xs">ATS Score</span>
              <span className={cn(
                "font-semibold",
                score >= 80 ? "text-green-600" : score >= 60 ? "text-amber-600" : "text-red-600"
              )}>
                {score}% Compatibility
              </span>
            </div>
          )}
          
          {isAts && (
            <div className="bg-background rounded border px-3 py-2 text-sm">
              <span className="text-muted-foreground block text-xs">Optimization</span>
              <span className="font-medium text-amber-700 dark:text-amber-500">AI Enhanced Layout</span>
            </div>
          )}
        </div>

        {/* Actions overlay for locked states */}
        {!hasAccess && (
          <div className="absolute inset-0 bg-background/60 backdrop-blur-[2px] flex items-center justify-center">
            <Button onClick={(e) => { e.stopPropagation(); onUpgrade?.(); }} className="bg-amber-500 hover:bg-amber-600 text-white shadow-lg">
              Upgrade to Premium <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        )}
        
        {/* Footers for hasAccess state */}
        {hasAccess && (
          <div className="flex items-center gap-2 mt-2 pt-2 border-t">
            {onPreview && (
              <Button variant="ghost" size="sm" className="text-xs h-7 px-2" onClick={(e) => { e.stopPropagation(); onPreview(); }}>
                <Eye className="w-3 h-3 mr-1" /> Preview
              </Button>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}

// Needed missing icon
import { Eye } from "lucide-react";

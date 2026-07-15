"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface PageHeaderProps {
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  actionIcon?: React.ReactNode;
  action?: React.ReactNode;
}

export function PageHeader({ title, description, actionLabel, onAction, actionIcon, action }: PageHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        {description && <p className="text-muted-foreground mt-1">{description}</p>}
      </div>
      {(actionLabel || action) && (
        <div className="flex gap-2">
          {action}
          {actionLabel && (
            <Button onClick={onAction}>
              {actionIcon || <Plus className="w-4 h-4 mr-2" />}
              {actionLabel}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

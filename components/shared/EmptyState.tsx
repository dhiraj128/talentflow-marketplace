"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Inbox } from "lucide-react";

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
  action?: any;
  [key: string]: any;
}

export function EmptyState({ title, description, icon, actionLabel, onAction, className, action, ...rest }: EmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center p-8 text-center border rounded-xl bg-card border-dashed min-h-[300px]", className)} {...rest}>
      <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4 text-muted-foreground">
        {icon || <Inbox className="h-6 w-6" />}
      </div>
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-sm text-muted-foreground max-w-sm mt-2 mb-6">{description}</p>
      {(actionLabel || action) && (
        actionLabel ? <Button onClick={onAction}>{actionLabel}</Button> : <div>{action?.label ? <Button><a href={action.href}>{action.label}</a></Button> : action}</div>
      )}
    </div>
  );
}

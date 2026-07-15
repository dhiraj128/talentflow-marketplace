"use client";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2 } from "lucide-react";

interface SubscriptionCardProps {
  planName: string;
  price: string;
  billingCycle: string;
  features: string[];
  isActive?: boolean;
  onAction?: () => void;
  actionLabel?: string;
}

export function SubscriptionCard({ planName, price, billingCycle, features, isActive, onAction, actionLabel }: SubscriptionCardProps) {
  return (
    <Card className={isActive ? "border-primary shadow-sm" : ""}>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl">{planName}</CardTitle>
          {isActive && <Badge>Active Plan</Badge>}
        </div>
        <div className="mt-4 flex items-baseline text-3xl font-bold">
          {price}
          <span className="ml-1 text-sm font-medium text-muted-foreground">{billingCycle}</span>
        </div>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3 text-sm">
          {features.map((feature, i) => (
            <li key={i} className="flex gap-x-3">
              <CheckCircle2 className="h-5 w-5 flex-none text-primary" aria-hidden="true" />
              {feature}
            </li>
          ))}
        </ul>
      </CardContent>
      {actionLabel && (
        <CardFooter>
          <Button className="w-full" variant={isActive ? "outline" : "default"} onClick={onAction}>
            {actionLabel}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}

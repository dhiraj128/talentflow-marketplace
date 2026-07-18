import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface HiringFunnelStage {
  label: string;
  count: number;
  percentage: number;
}

interface HiringFunnelWidgetProps {
  stages: HiringFunnelStage[];
}

export function HiringFunnelWidget({ stages }: HiringFunnelWidgetProps) {
  // Find max count to scale widths
  const maxCount = Math.max(...stages.map(s => s.count), 1);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Hiring Funnel</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {stages.map((stage, index) => {
            const widthPercent = Math.max((stage.count / maxCount) * 100, 5); // Minimum 5% width for visibility
            
            return (
              <div key={stage.label} className="relative">
                <div className="flex items-center justify-between mb-1 text-sm">
                  <span className="font-medium text-foreground">{stage.label}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-muted-foreground">{stage.count}</span>
                    <Badge variant="secondary" className="w-14 justify-center text-xs bg-primary/10">
                      {stage.percentage}%
                    </Badge>
                  </div>
                </div>
                <div className="h-3 w-full bg-muted rounded-full overflow-hidden">
                  <div 
                    className={cn(
                      "h-full rounded-full transition-all duration-1000 ease-out",
                      index === 0 ? "bg-blue-500" :
                      index === 1 ? "bg-indigo-500" :
                      index === 2 ? "bg-purple-500" :
                      index === 3 ? "bg-pink-500" :
                      index === 4 ? "bg-orange-500" :
                      index === 5 ? "bg-emerald-500" :
                      "bg-green-600"
                    )}
                    style={{ width: `${widthPercent}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

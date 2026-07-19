import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, MessageSquare, Star, DollarSign } from "lucide-react";

export function TrainerActivityFeed({ data }: { data?: any }) {
  const activities = data?.recentActivity || [];

  return (
    <Card className="border-border/60">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-bold flex items-center gap-2">
          <Activity className="w-5 h-5 text-indigo-500" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground text-sm border border-dashed rounded-lg">
              No recent activity found.
            </div>
          ) : (
            activities.map((item: any) => (
              <div key={item.id} className="flex gap-4 items-start p-3 rounded-lg hover:bg-muted/30 transition-colors">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5 bg-indigo-100 text-indigo-500 dark:bg-indigo-900/30`}>
                  <Activity className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm">
                    <span className="font-semibold">{item.user?.name || "Someone"}</span> {item.action} {item.target}
                  </p>
                  <span className="text-xs text-muted-foreground mt-1 block">{item.time || "Recently"}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}

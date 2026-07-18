import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, MessageSquare, Star, DollarSign } from "lucide-react";

export function TrainerActivityFeed() {
  const activities = [
    { id: 1, type: "review", message: "Left a 5-star review on Advanced React Patterns", user: "Alex Johnson", time: "2 hours ago", icon: Star, color: "text-amber-500", bg: "bg-amber-100 dark:bg-amber-900/30" },
    { id: 2, type: "purchase", message: "Purchased Node.js Microservices", user: "Sam Smith", time: "5 hours ago", icon: DollarSign, color: "text-green-500", bg: "bg-green-100 dark:bg-green-900/30" },
    { id: 3, type: "comment", message: "Asked a question in Lesson 4", user: "Maria Garcia", time: "Yesterday", icon: MessageSquare, color: "text-blue-500", bg: "bg-blue-100 dark:bg-blue-900/30" },
  ];

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
          {activities.map((item) => (
            <div key={item.id} className="flex gap-4 items-start p-3 rounded-lg hover:bg-muted/30 transition-colors">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${item.bg} ${item.color}`}>
                <item.icon className="w-4 h-4" />
              </div>
              <div>
                <p className="text-sm">
                  <span className="font-semibold">{item.user}</span> {item.message}
                </p>
                <span className="text-xs text-muted-foreground mt-1 block">{item.time}</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

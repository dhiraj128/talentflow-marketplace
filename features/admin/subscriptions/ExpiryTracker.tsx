import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, AlertTriangle, Send } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ExpiryTracker() {
  const expiringData = [
    { period: "Expiring Today", count: 12, items: [{ user: "John Doe", plan: "Pro" }, { user: "Acme Corp", plan: "Enterprise" }] },
    { period: "Next 7 Days", count: 45, items: [{ user: "Sarah Smith", plan: "Pro" }] },
    { period: "Next 30 Days", count: 128, items: [] },
  ];

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Clock className="w-5 h-5" /> Expiry Tracker
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {expiringData.map((data, i) => (
          <div key={i} className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {i === 0 && <AlertTriangle className="w-4 h-4 text-red-500" />}
                <span className={`font-medium ${i === 0 ? 'text-red-500' : ''}`}>{data.period}</span>
              </div>
              <span className="font-bold text-lg">{data.count}</span>
            </div>
            
            {data.items.length > 0 && (
              <div className="bg-muted/50 rounded-lg p-3 space-y-2">
                {data.items.map((item, j) => (
                  <div key={j} className="flex items-center justify-between text-sm">
                    <div>
                      <span className="font-medium">{item.user}</span>
                      <span className="text-muted-foreground ml-2">({item.plan})</span>
                    </div>
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-muted-foreground hover:text-primary">
                      <Send className="w-3 h-3" />
                    </Button>
                  </div>
                ))}
                {data.count > data.items.length && (
                  <div className="text-xs text-muted-foreground pt-1 border-t">
                    + {data.count - data.items.length} more...
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
        
        <Button className="w-full mt-4" variant="outline">
          View All Expiring
        </Button>
      </CardContent>
    </Card>
  );
}

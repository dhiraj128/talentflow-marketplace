import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell, AlertCircle, Info } from "lucide-react";

export function TrainerNotifications({ data }: { data?: any }) {
  const notifications = data?.notifications || [];

  return (
    <Card className="border-border/60">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-bold flex items-center gap-2">
          <Bell className="w-5 h-5 text-rose-500" />
          Notifications
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {notifications.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground text-sm border border-dashed rounded-lg">
              No new notifications
            </div>
          ) : (
            notifications.map((notif: any) => (
              <div key={notif.id} className="flex gap-4 p-4 border border-border/60 rounded-lg bg-muted/20">
                <div className="shrink-0 mt-0.5">
                  {notif.type === 'alert' ? <AlertCircle className="w-5 h-5 text-amber-500" /> : <Info className="w-5 h-5 text-blue-500" />}
                </div>
                <div>
                  <h4 className="font-semibold text-sm mb-1">{notif.title}</h4>
                  <p className="text-sm text-muted-foreground">{notif.message}</p>
                  <span className="text-xs text-muted-foreground mt-2 block font-medium">{notif.time || "Just now"}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}

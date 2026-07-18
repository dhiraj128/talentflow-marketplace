import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell, AlertCircle, Info } from "lucide-react";

export function TrainerNotifications() {
  const notifications = [
    { id: 1, title: "Platform Update", message: "New video player features are now available for your courses.", type: "info", time: "1 day ago" },
    { id: 2, title: "Course Review Pending", message: "Your new course 'Next.js Masterclass' is under review by admins.", type: "alert", time: "2 days ago" },
  ];

  return (
    <Card className="border-border/60 h-full">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-bold flex items-center gap-2">
          <Bell className="w-5 h-5 text-rose-500" />
          Notifications
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {notifications.map((notif) => (
            <div key={notif.id} className="flex gap-4 p-4 border border-border/60 rounded-lg bg-muted/20">
              <div className="shrink-0 mt-0.5">
                {notif.type === 'alert' ? <AlertCircle className="w-5 h-5 text-amber-500" /> : <Info className="w-5 h-5 text-blue-500" />}
              </div>
              <div>
                <h4 className="font-semibold text-sm mb-1">{notif.title}</h4>
                <p className="text-sm text-muted-foreground">{notif.message}</p>
                <span className="text-xs text-muted-foreground mt-2 block font-medium">{notif.time}</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

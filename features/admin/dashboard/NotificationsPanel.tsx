import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell, Info, AlertCircle, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: "info" | "warning" | "success" | "error";
  time: string;
}

export function NotificationsPanel({ notifications }: { notifications: Notification[] }) {
  const getIcon = (type: string) => {
    switch (type) {
      case "warning": return <AlertCircle className="w-5 h-5 text-amber-500" />;
      case "success": return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "error": return <AlertCircle className="w-5 h-5 text-red-500" />;
      default: return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3 border-b flex flex-row items-center justify-between">
        <CardTitle className="text-lg flex items-center gap-2">
          <Bell className="w-5 h-5" /> Notifications
        </CardTitle>
        <Button variant="ghost" size="sm" className="text-xs">Mark all read</Button>
      </CardHeader>
      <CardContent className="p-0 flex-1 overflow-y-auto">
        <div className="divide-y">
          {notifications.map((notification) => (
            <div key={notification.id} className="p-4 flex items-start gap-3 hover:bg-muted/30 transition-colors cursor-pointer">
              <div className="mt-0.5">{getIcon(notification.type)}</div>
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">{notification.title}</p>
                <p className="text-sm text-muted-foreground line-clamp-2">{notification.message}</p>
                <p className="text-xs text-muted-foreground">{notification.time}</p>
              </div>
            </div>
          ))}
          {notifications.length === 0 && (
            <div className="p-8 text-center text-muted-foreground text-sm">
              No new notifications
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

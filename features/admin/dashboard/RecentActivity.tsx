import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Activity {
  id: string;
  user: {
    name: string;
    avatar?: string;
  };
  action: string;
  target: string;
  time: string;
}

export function RecentActivity({ activities }: { activities: Activity[] }) {
  return (
    <Card className="h-full overflow-hidden flex flex-col">
      <CardHeader className="pb-3 border-b">
        <CardTitle className="text-lg">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent className="p-0 flex-1 overflow-y-auto">
        {!activities || activities.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8 text-center text-muted-foreground">
            <p className="font-medium text-sm">No recent platform activity yet</p>
            <p className="text-xs text-muted-foreground/60 mt-1">System actions and user registrations will appear here.</p>
          </div>
        ) : (
          <div className="divide-y">
            {activities.map((activity) => (
              <div key={activity.id} className="p-4 flex items-start gap-3 hover:bg-muted/50 transition-colors">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={activity.user.avatar} />
                  <AvatarFallback>{activity.user.name ? activity.user.name.charAt(0) : "U"}</AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                  <p className="text-sm">
                    <span className="font-medium text-foreground">{activity.user.name}</span>{" "}
                    <span className="text-muted-foreground">{activity.action}</span>{" "}
                    <span className="font-medium text-foreground">{activity.target}</span>
                  </p>
                  <p className="text-xs text-muted-foreground">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

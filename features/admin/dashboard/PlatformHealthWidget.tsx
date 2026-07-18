import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, AlertTriangle, Server, Database, Globe } from "lucide-react";

export function PlatformHealthWidget() {
  const services = [
    { name: "API Server", status: "operational", icon: Server },
    { name: "PostgreSQL Database", status: "operational", icon: Database },
    { name: "CDN & Assets", status: "operational", icon: Globe },
    { name: "Payment Gateway", status: "degraded", icon: AlertTriangle },
  ];

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          Platform Health
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {services.map((service, i) => (
          <div key={i} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-md ${service.status === 'operational' ? 'bg-green-500/10 text-green-500' : 'bg-amber-500/10 text-amber-500'}`}>
                <service.icon className="w-4 h-4" />
              </div>
              <span className="font-medium text-sm">{service.name}</span>
            </div>
            <span className="text-xs font-medium uppercase px-2 py-1 rounded-full bg-secondary text-secondary-foreground">
              {service.status}
            </span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

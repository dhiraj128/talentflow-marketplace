import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, UserPlus, Tag, Settings, Zap } from "lucide-react";
import Link from "next/link";

export function QuickActions() {
  const actions = [
    { label: "New Coupon", icon: Tag, href: "/admin/settings/coupons" },
    { label: "New Offer", icon: Zap, href: "/admin/settings/offers" },
    { label: "Add Category", icon: PlusCircle, href: "/admin/settings/categories" },
    { label: "Platform Settings", icon: Settings, href: "/admin/settings" },
  ];

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-lg">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
          {actions.map((action, i) => (
            <Link key={i} href={action.href} className="w-full focus:outline-none">
              <Button 
                variant="outline" 
                className="w-full h-24 p-4 flex items-center justify-start gap-3 rounded-xl transition-all duration-200 hover:bg-primary/5 hover:border-primary/50 active:scale-95 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              >
                <action.icon className="w-6 h-6 shrink-0 text-primary" aria-hidden="true" />
                <span className="text-sm font-medium">{action.label}</span>
              </Button>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

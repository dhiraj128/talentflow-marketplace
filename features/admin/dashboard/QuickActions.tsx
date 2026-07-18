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
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {actions.map((action, i) => (
            <Link key={i} href={action.href} className="w-full">
              <Button variant="outline" className="w-full h-20 flex-col gap-2 justify-center">
                <action.icon className="w-5 h-5 text-primary" />
                <span className="text-xs">{action.label}</span>
              </Button>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

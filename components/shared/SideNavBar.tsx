"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  LogOut,
  HelpCircle,
} from "lucide-react";

export interface SidebarRoute {
  label: string;
  icon: React.ElementType;
  href: string;
}

interface SideNavBarProps {
  routes: SidebarRoute[];
  title?: string;
  isOpen?: boolean;
}

export function SideNavBar({ routes, title = "Menu", isOpen = true }: SideNavBarProps) {
  const pathname = usePathname();

  if (!isOpen) return null;

  return (
    <div className="flex h-full w-64 flex-col border-r bg-secondary/30">
      <div className="flex h-16 items-center px-6 border-b">
        <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
      </div>
      <ScrollArea className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-1">
          {routes.map((route) => {
            const isActive = pathname === route.href || pathname.startsWith(route.href + '/');
            return (
              <Link 
                key={route.href}
                href={route.href}
                className={cn(
                  buttonVariants({ variant: isActive ? "secondary" : "ghost" }),
                  "w-full justify-start",
                  isActive ? "bg-secondary text-foreground" : "text-muted-foreground hover:text-foreground"
                )}
              >
                <route.icon className="mr-3 h-5 w-5" />
                {route.label}
              </Link>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}

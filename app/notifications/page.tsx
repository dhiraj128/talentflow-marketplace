"use client";

import React from "react";
import { TopNavBar } from "@/components/shared/TopNavBar";
import { NotificationCenter } from "@/components/shared/NotificationCenter";
import { useAuth } from "@/lib/auth-context";

export default function UniversalNotificationsPage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <TopNavBar />
      <main className="flex-1 py-6">
        <NotificationCenter role={user?.role ? String(user.role) : undefined} />
      </main>
    </div>
  );
}

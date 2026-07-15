"use client";

import { PageHeader } from "@/components/shared/PageHeader";
import { EmptyState } from "@/components/shared/EmptyState";
import { MessageSquare } from "lucide-react";
import { Card } from "@/components/ui/card";

export default function MessagesPage() {
  return (
    <div className="max-w-7xl mx-auto p-8 space-y-8 h-[calc(100vh-8rem)] flex flex-col">
      <PageHeader 
        title="Messages" 
        description="Communicate with recruiters and hiring managers"
      />

      <Card className="flex-1 flex items-center justify-center border-dashed">
        <EmptyState
          icon={<MessageSquare className="h-10 w-10 text-muted-foreground" />}
          title="No messages yet"
          description="When you start applying and employers reach out, your conversations will appear here."
        />
      </Card>
    </div>
  );
}

"use client";

import React from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, Paperclip } from "lucide-react";

export default function MessagesPage() {
  return (
    <div className="max-w-7xl mx-auto p-8 space-y-8 h-[calc(100vh-4rem)] flex flex-col">
      <PageHeader 
        title="Messages" 
        description="Communicate with your clients."
      />

      <Card className="flex-1 flex overflow-hidden min-h-0 border">
        {/* Sidebar */}
        <div className="w-1/3 border-r flex flex-col">
          <div className="p-4 border-b">
            <Input placeholder="Search messages..." />
          </div>
          <div className="flex-1 overflow-y-auto">
            {[1, 2, 3].map((i) => (
              <div key={i} className={`p-4 border-b cursor-pointer hover:bg-muted/50 ${i === 1 ? 'bg-muted/50' : ''}`}>
                <div className="flex justify-between items-start mb-1">
                  <h4 className="font-medium">Client {i}</h4>
                  <span className="text-xs text-muted-foreground">10:4{i} AM</span>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-1">Can we schedule a call to discuss the next milestone?</p>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col bg-slate-50/50">
          <div className="p-4 border-b bg-card">
            <h3 className="font-semibold text-lg">Client 1</h3>
            <p className="text-sm text-muted-foreground">Active now</p>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            <div className="flex justify-start">
              <div className="bg-card border rounded-lg p-3 max-w-[70%]">
                <p className="text-sm">Hi, how is the progress on the design?</p>
                <span className="text-xs text-muted-foreground mt-1 block">10:40 AM</span>
              </div>
            </div>
            <div className="flex justify-end">
              <div className="bg-primary text-primary-foreground rounded-lg p-3 max-w-[70%]">
                <p className="text-sm">I've completed the first draft. I'll send it over shortly!</p>
                <span className="text-xs text-primary-foreground/80 mt-1 block">10:45 AM</span>
              </div>
            </div>
          </div>

          <div className="p-4 border-t bg-card flex gap-2 items-center">
            <Button variant="ghost" size="icon">
              <Paperclip className="w-5 h-5 text-muted-foreground" />
            </Button>
            <Input placeholder="Type a message..." className="flex-1" />
            <Button size="icon">
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}

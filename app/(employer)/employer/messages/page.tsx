import React from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Send, User } from "lucide-react";

export default function MessagesPage() {
  return (
    <div className="max-w-7xl mx-auto p-8 space-y-8 h-[calc(100vh-4rem)] flex flex-col">
      <PageHeader title="Messages" description="Communicate with candidates." />
      
      <Card className="flex-1 flex overflow-hidden min-h-[500px]">
        <div className="w-1/3 border-r flex flex-col">
          <div className="p-4 border-b">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search messages..." className="pl-9" />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {[1, 2, 3].map((i) => (
              <div key={i} className={`p-4 border-b cursor-pointer hover:bg-muted/50 ${i === 1 ? 'bg-muted' : ''}`}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm">Candidate {i}</h4>
                    <p className="text-xs text-muted-foreground truncate">Thanks for reaching out! I am available...</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex-1 flex flex-col">
          <div className="p-4 border-b flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h4 className="font-semibold">Candidate 1</h4>
              <p className="text-xs text-muted-foreground">Applying for Frontend Developer</p>
            </div>
          </div>
          <div className="flex-1 p-4 overflow-y-auto bg-muted/10">
            <div className="flex flex-col gap-4">
              <div className="self-start max-w-[80%] bg-white border p-3 rounded-lg text-sm">
                Hi, I wanted to follow up on my application.
              </div>
              <div className="self-end max-w-[80%] bg-primary text-primary-foreground p-3 rounded-lg text-sm">
                Hello! Thanks for your interest. We are reviewing your profile.
              </div>
            </div>
          </div>
          <div className="p-4 border-t bg-background">
            <div className="flex gap-2">
              <Input placeholder="Type your message..." className="flex-1" />
              <Button size="icon"><Send className="w-4 h-4" /></Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

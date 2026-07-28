"use client";
import React, { useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, Send, ArrowLeft, User } from "lucide-react";

export default function MessagesPage() {
  const [activeConversation, setActiveConversation] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [newMessage, setNewMessage] = useState("");

  const conversations = [
    { id: 1, name: "Rahul Sharma", avatar: "/avatars/1.png", lastMessage: "Thanks for the feedback on my assignment!", time: "10:42 AM", unread: 2 },
    { id: 2, name: "Priya Patel", avatar: "/avatars/2.png", lastMessage: "When is the next live session?", time: "Yesterday", unread: 0 },
    { id: 3, name: "Amit Kumar", avatar: "/avatars/3.png", lastMessage: "I'm having trouble with useEffect.", time: "Tuesday", unread: 0 },
    { id: 4, name: "Sneha Gupta", avatar: "/avatars/4.png", lastMessage: "Can you review my final project?", time: "Oct 15", unread: 0 },
  ];

  const filteredConversations = conversations.filter(chat => {
    const query = searchTerm.toLowerCase();
    return chat.name.toLowerCase().includes(query) || chat.lastMessage.toLowerCase().includes(query);
  });

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-6 md:space-y-8 h-[calc(100vh-4rem)] flex flex-col">
      <PageHeader 
        title="Messages" 
        description="Communicate directly with your students." 
      />
      
      <Card className="flex-1 flex overflow-hidden min-h-[400px] border shadow-sm">
        {/* Sidebar / Conversation List */}
        <div className={`w-full md:w-1/3 border-r flex flex-col bg-muted/10 ${activeConversation ? 'hidden md:flex' : 'flex'}`}>
          <div className="p-4 border-b">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground shrink-0 pointer-events-none" />
              <Input 
                placeholder="Search messages..." 
                className="pl-9 w-full min-w-0" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {filteredConversations.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground text-sm">No conversations found.</div>
            ) : filteredConversations.map((chat) => (
              <div 
                key={chat.id} 
                className={`p-4 border-b flex gap-3 cursor-pointer hover:bg-muted/50 transition-colors ${activeConversation?.id === chat.id ? 'bg-muted' : ''}`}
                onClick={() => setActiveConversation(chat)}
              >
                <Avatar className="shrink-0">
                  <AvatarImage src={chat.avatar} />
                  <AvatarFallback>{chat.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0 overflow-hidden">
                  <div className="flex justify-between items-baseline mb-1">
                    <h4 className={`text-sm truncate ${chat.unread ? 'font-semibold' : 'font-medium'}`}>{chat.name}</h4>
                    <span className="text-xs text-muted-foreground shrink-0">{chat.time}</span>
                  </div>
                  <p className={`text-xs truncate ${chat.unread ? 'font-medium text-foreground' : 'text-muted-foreground'}`}>
                    {chat.lastMessage}
                  </p>
                </div>
                {chat.unread > 0 && (
                  <div className="h-5 w-5 bg-primary text-primary-foreground rounded-full text-[10px] flex items-center justify-center font-medium self-center shrink-0">
                    {chat.unread}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className={`w-full md:w-2/3 flex-1 flex flex-col bg-slate-50/30 ${!activeConversation ? 'hidden md:flex' : 'flex'}`}>
          {activeConversation ? (
            <>
              <div className="p-4 border-b flex justify-between items-center bg-card">
                <div className="flex items-center gap-3">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="md:hidden shrink-0" 
                    onClick={() => setActiveConversation(null)}
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </Button>
                  <Avatar className="shrink-0">
                    <AvatarImage src={activeConversation.avatar} />
                    <AvatarFallback>{activeConversation.name.split(' ').map((n: string) => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-sm truncate">{activeConversation.name}</h3>
                    <p className="text-xs text-green-500">Active now</p>
                  </div>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/10">
                <div className="flex flex-col gap-2 items-center text-xs text-muted-foreground my-2">
                  <span>Today</span>
                </div>
                
                <div className="flex gap-3">
                  <Avatar className="h-8 w-8 shrink-0">
                    <AvatarFallback>{activeConversation.name.split(' ').map((n: string) => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div className="bg-card border rounded-2xl rounded-tl-none p-3 max-w-[85%] sm:max-w-[75%] text-sm shadow-sm">
                    <p>{activeConversation.lastMessage}</p>
                    <span className="text-[10px] text-muted-foreground mt-1 block">{activeConversation.time}</span>
                  </div>
                </div>
                
                <div className="flex gap-3 flex-row-reverse">
                  <div className="bg-primary text-primary-foreground rounded-2xl rounded-tr-none p-3 max-w-[85%] sm:max-w-[75%] text-sm">
                    <p>Hello! Thanks for reaching out. Let me know if you have any questions.</p>
                    <span className="text-[10px] text-primary-foreground/70 mt-1 block text-right">10:45 AM</span>
                  </div>
                </div>
              </div>

              <div className="p-4 border-t bg-card">
                <form 
                  onSubmit={(e) => { e.preventDefault(); setNewMessage(""); }} 
                  className="flex gap-2 items-center"
                >
                  <Input 
                    placeholder="Type a message..." 
                    className="flex-1 min-w-0" 
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                  />
                  <Button type="submit" size="icon" disabled={!newMessage.trim()} className="shrink-0">
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground p-8 text-center">
              <User className="w-12 h-12 stroke-1 mb-3 text-muted-foreground/50" />
              <p className="text-sm font-medium">Select a student from the list to start messaging</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}

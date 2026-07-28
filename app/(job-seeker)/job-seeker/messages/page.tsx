"use client";
import React, { useEffect, useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Send, User, ArrowLeft } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { messageService } from "@/lib/services/message.service";

export default function MessagesPage() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<any[]>([]);
  const [activeConversation, setActiveConversation] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (user?.id) {
      messageService.getConversations(user.id).then(setConversations).catch(console.error);
    }
  }, [user]);

  useEffect(() => {
    if (activeConversation) {
      messageService.getMessages(activeConversation.id).then(setMessages).catch(console.error);
    }
  }, [activeConversation]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !activeConversation || !user) return;
    try {
      const msg = await messageService.sendMessage(activeConversation.id, user.id, newMessage);
      setMessages([...messages, msg]);
      setNewMessage("");
    } catch (e) {
      console.error(e);
    }
  };

  const filteredConversations = conversations.filter(conv => {
    const otherParticipantId = conv.participant1Id === user?.id ? conv.participant2Id : conv.participant1Id;
    const name = conv.otherUser?.fullName || conv.otherUser?.email || `User ${otherParticipantId?.substring(0, 4)}`;
    const lastMsg = conv.messages?.[0]?.content || "";
    const query = searchTerm.toLowerCase();
    return name.toLowerCase().includes(query) || lastMsg.toLowerCase().includes(query);
  });

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-6 md:space-y-8 h-[calc(100vh-4rem)] flex flex-col">
      <PageHeader title="Messages" description="Communicate with recruiters and hiring managers." />
      
      <Card className="flex-1 flex overflow-hidden min-h-[400px] border shadow-sm">
        {/* Sidebar / Conversation List */}
        <div className={`w-full md:w-1/3 border-r flex flex-col ${activeConversation ? 'hidden md:flex' : 'flex'}`}>
          <div className="p-4 border-b">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground shrink-0 pointer-events-none" />
              <Input 
                placeholder="Search conversations..." 
                className="pl-9 w-full min-w-0" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {filteredConversations.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground text-sm">No conversations found.</div>
            ) : filteredConversations.map((conv) => {
              const otherParticipantId = conv.participant1Id === user?.id ? conv.participant2Id : conv.participant1Id;
              const lastMessage = conv.messages?.[0];
              const name = conv.otherUser?.fullName || conv.otherUser?.email || `User ${otherParticipantId?.substring(0, 4)}`;
              return (
                <div 
                  key={conv.id} 
                  className={`p-4 border-b cursor-pointer hover:bg-muted/50 transition-colors ${activeConversation?.id === conv.id ? 'bg-muted' : ''}`}
                  onClick={() => setActiveConversation(conv)}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <User className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0 overflow-hidden">
                      <h4 className="font-semibold text-sm truncate">{name}</h4>
                      <p className="text-xs text-muted-foreground truncate">{lastMessage?.content || "No messages yet"}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Chat Pane */}
        <div className={`w-full md:w-2/3 flex-1 flex flex-col bg-slate-50/30 ${!activeConversation ? 'hidden md:flex' : 'flex'}`}>
          {activeConversation ? (
            <>
              <div className="p-4 border-b flex items-center gap-3 bg-background">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="md:hidden shrink-0" 
                  onClick={() => setActiveConversation(null)}
                >
                  <ArrowLeft className="w-5 h-5" />
                </Button>
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <User className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-sm md:text-base truncate">
                    {activeConversation.otherUser?.fullName || activeConversation.otherUser?.email || `User ${(activeConversation.participant1Id === user?.id ? activeConversation.participant2Id : activeConversation.participant1Id)?.substring(0, 4)}`}
                  </h4>
                  <span className="text-xs text-muted-foreground">Active conversation</span>
                </div>
              </div>
              <div className="flex-1 p-4 overflow-y-auto space-y-4">
                {messages.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-muted-foreground text-sm">
                    No messages yet. Send a message below!
                  </div>
                ) : (
                  messages.map(msg => (
                    <div key={msg.id} className={`max-w-[85%] sm:max-w-[75%] p-3 rounded-xl text-sm ${msg.senderId === user?.id ? 'self-end bg-primary text-primary-foreground ml-auto' : 'self-start bg-background border mr-auto shadow-sm'}`}>
                      {msg.content}
                    </div>
                  ))
                )}
              </div>
              <div className="p-4 border-t bg-background">
                <form 
                  onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}
                  className="flex gap-2 items-center"
                >
                  <Input 
                    placeholder="Type your message..." 
                    className="flex-1 min-w-0" 
                    value={newMessage} 
                    onChange={e => setNewMessage(e.target.value)}
                  />
                  <Button type="submit" size="icon" disabled={!newMessage.trim()} className="shrink-0">
                    <Send className="w-4 h-4" />
                  </Button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground p-8 text-center">
              <User className="w-12 h-12 stroke-1 mb-3 text-muted-foreground/50" />
              <p className="text-sm font-medium">Select a conversation from the list to start messaging</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}

"use client";

import React, { useEffect, useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, Paperclip, Search, ArrowLeft, User } from "lucide-react";
import api from "@/lib/api";

export default function MessagesPage() {
  const [activeConversation, setActiveConversation] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [conversations, setConversations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchConversations();
  }, []);

  const fetchConversations = async () => {
    setIsLoading(true);
    try {
      const res = await api.get('/messages/conversations').catch(() => null);
      const list = Array.isArray(res?.data) ? res.data : res?.data?.data || [];
      setConversations(list);
    } catch (e) {
      console.warn("Failed to load conversations", e);
      setConversations([]);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredConversations = conversations.filter(conv => {
    const query = searchTerm.toLowerCase();
    return (conv.name || conv.title || "").toLowerCase().includes(query) ||
           (conv.lastMessage || "").toLowerCase().includes(query);
  });

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-6 md:space-y-8 h-[calc(100vh-4rem)] flex flex-col">
      <PageHeader
        title="Messages"
        description="Communicate with your clients."
      />

      <Card className="flex-1 flex overflow-hidden min-h-[400px] border shadow-sm">
        {/* Sidebar / Conversation List */}
        <div className={`w-full md:w-1/3 border-r flex flex-col ${activeConversation ? 'hidden md:flex' : 'flex'}`}>
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
            {isLoading ? (
              <div className="p-8 text-center text-muted-foreground text-sm">Loading messages...</div>
            ) : filteredConversations.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground text-sm">No conversations found.</div>
            ) : filteredConversations.map((conv) => (
              <div
                key={conv.id}
                className={`p-4 border-b cursor-pointer hover:bg-muted/50 transition-colors ${activeConversation?.id === conv.id ? 'bg-muted' : ''}`}
                onClick={() => setActiveConversation(conv)}
              >
                <div className="flex justify-between items-start mb-1">
                  <h4 className="font-medium text-sm truncate">{conv.name || "Client"}</h4>
                  <span className="text-xs text-muted-foreground shrink-0">{conv.time || "Recently"}</span>
                </div>
                <p className="text-xs text-muted-foreground truncate">{conv.lastMessage || "No message content"}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className={`w-full md:w-2/3 flex-1 flex flex-col bg-slate-50/30 ${!activeConversation ? 'hidden md:flex' : 'flex'}`}>
          {activeConversation ? (
            <>
              <div className="p-4 border-b bg-card flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden shrink-0"
                  onClick={() => setActiveConversation(null)}
                >
                  <ArrowLeft className="w-5 h-5" />
                </Button>
                <div>
                  <h3 className="font-semibold text-base">{activeConversation.name || "Client"}</h3>
                  <p className="text-xs text-muted-foreground">Active now</p>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                <div className="flex justify-start">
                  <div className="bg-card border rounded-lg p-3 max-w-[85%] sm:max-w-[70%] text-sm shadow-sm">
                    <p>{activeConversation.lastMessage || "Hello!"}</p>
                  </div>
                </div>
              </div>

              <div className="p-4 border-t bg-card flex gap-2 items-center">
                <Button variant="ghost" size="icon" type="button" className="shrink-0">
                  <Paperclip className="w-5 h-5 text-muted-foreground" />
                </Button>
                <Input
                  placeholder="Type a message..."
                  className="flex-1 min-w-0"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                />
                <Button size="icon" type="button" onClick={() => setNewMessage("")} className="shrink-0">
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground p-8 text-center">
              <User className="w-12 h-12 stroke-1 mb-3 text-muted-foreground/50" />
              <p className="text-sm font-medium">Select a conversation to start messaging</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}

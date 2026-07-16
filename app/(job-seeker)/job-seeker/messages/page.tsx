"use client";
import React, { useEffect, useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Send, User } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { messageService } from "@/lib/services/message.service";

export default function MessagesPage() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<any[]>([]);
  const [activeConversation, setActiveConversation] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");

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

  return (
    <div className="max-w-7xl mx-auto p-8 space-y-8 h-[calc(100vh-4rem)] flex flex-col">
      <PageHeader title="Messages" description="Communicate with recruiters and hiring managers." />
      
      <Card className="flex-1 flex overflow-hidden min-h-[500px]">
        <div className="w-1/3 border-r flex flex-col">
          <div className="p-4 border-b">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search messages..." className="pl-9" />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {conversations.length === 0 ? (
              <div className="p-4 text-center text-muted-foreground text-sm">No conversations found.</div>
            ) : conversations.map((conv) => {
              const otherParticipantId = conv.participant1Id === user?.id ? conv.participant2Id : conv.participant1Id;
              const lastMessage = conv.messages?.[0];
              return (
                <div 
                  key={conv.id} 
                  className={`p-4 border-b cursor-pointer hover:bg-muted/50 ${activeConversation?.id === conv.id ? 'bg-muted' : ''}`}
                  onClick={() => setActiveConversation(conv)}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <h4 className="font-semibold text-sm">User {otherParticipantId.substring(0, 4)}</h4>
                      <p className="text-xs text-muted-foreground truncate">{lastMessage?.content || "No messages yet"}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="flex-1 flex flex-col">
          {activeConversation ? (
            <>
              <div className="p-4 border-b flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold">Conversation</h4>
                </div>
              </div>
              <div className="flex-1 p-4 overflow-y-auto bg-muted/10">
                <div className="flex flex-col gap-4">
                  {messages.map(msg => (
                    <div key={msg.id} className={`max-w-[80%] p-3 rounded-lg text-sm ${msg.senderId === user?.id ? 'self-end bg-primary text-primary-foreground' : 'self-start bg-white border'}`}>
                      {msg.content}
                    </div>
                  ))}
                </div>
              </div>
              <div className="p-4 border-t bg-background">
                <div className="flex gap-2">
                  <Input 
                    placeholder="Type your message..." 
                    className="flex-1" 
                    value={newMessage} 
                    onChange={e => setNewMessage(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
                  />
                  <Button size="icon" onClick={handleSendMessage}><Send className="w-4 h-4" /></Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-muted-foreground">
              Select a conversation to start messaging
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}

"use client";
import { PageHeader } from "@/components/shared/PageHeader"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, Send, MoreVertical, Phone, Video } from "lucide-react"

export default function MessagesPage() {
  const conversations = [
    { id: 1, name: "Rahul Sharma", avatar: "/avatars/1.png", lastMessage: "Thanks for the feedback on my assignment!", time: "10:42 AM", unread: 2 },
    { id: 2, name: "Priya Patel", avatar: "/avatars/2.png", lastMessage: "When is the next live session?", time: "Yesterday", unread: 0 },
    { id: 3, name: "Amit Kumar", avatar: "/avatars/3.png", lastMessage: "I'm having trouble with useEffect.", time: "Tuesday", unread: 0 },
    { id: 4, name: "Sneha Gupta", avatar: "/avatars/4.png", lastMessage: "Can you review my final project?", time: "Oct 15", unread: 0 },
  ]

  return (
    <>
      <PageHeader 
        title="Messages" 
        description="Communicate directly with your students." 
      />
      
      <Card className="flex h-[calc(100vh-220px)] min-h-[500px] overflow-hidden">
        {/* Sidebar */}
        <div className="w-1/3 border-r flex flex-col bg-muted/10">
          <div className="p-4 border-b">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search messages..." className="pl-9" />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {conversations.map((chat) => (
              <div 
                key={chat.id} 
                className={`p-4 border-b flex gap-3 cursor-pointer hover:bg-muted/50 transition-colors ${chat.unread ? 'bg-primary/5' : ''}`}
              >
                <Avatar>
                  <AvatarImage src={chat.avatar} />
                  <AvatarFallback>{chat.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <div className="flex-1 overflow-hidden">
                  <div className="flex justify-between items-baseline mb-1">
                    <h4 className={`text-sm truncate ${chat.unread ? 'font-semibold' : 'font-medium'}`}>{chat.name}</h4>
                    <span className="text-xs text-muted-foreground">{chat.time}</span>
                  </div>
                  <p className={`text-xs truncate ${chat.unread ? 'font-medium text-foreground' : 'text-muted-foreground'}`}>
                    {chat.lastMessage}
                  </p>
                </div>
                {chat.unread > 0 && (
                  <div className="h-5 w-5 bg-primary text-primary-foreground rounded-full text-[10px] flex items-center justify-center font-medium self-center">
                    {chat.unread}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          <div className="p-4 border-b flex justify-between items-center bg-card">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarFallback>RS</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold text-sm">Rahul Sharma</h3>
                <p className="text-xs text-green-500">Online</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" size="icon"><Phone className="h-4 w-4" /></Button>
              <Button variant="ghost" size="icon"><Video className="h-4 w-4" /></Button>
              <Button variant="ghost" size="icon"><MoreVertical className="h-4 w-4" /></Button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/10">
            <div className="flex flex-col gap-2 items-center text-xs text-muted-foreground my-4">
              <span>Today</span>
            </div>
            
            <div className="flex gap-3">
              <Avatar className="h-8 w-8">
                <AvatarFallback>RS</AvatarFallback>
              </Avatar>
              <div className="bg-card border rounded-2xl rounded-tl-none p-3 max-w-[75%] text-sm">
                <p>Hi Instructor, I submitted my assignment for Module 3 yesterday.</p>
                <span className="text-[10px] text-muted-foreground mt-1 block">10:30 AM</span>
              </div>
            </div>
            
            <div className="flex gap-3 flex-row-reverse">
              <div className="bg-primary text-primary-foreground rounded-2xl rounded-tr-none p-3 max-w-[75%] text-sm">
                <p>Hello Rahul! Yes, I saw it. You did a great job on the component structure.</p>
                <span className="text-[10px] text-primary-foreground/70 mt-1 block text-right">10:35 AM</span>
              </div>
            </div>

            <div className="flex gap-3 flex-row-reverse">
              <div className="bg-primary text-primary-foreground rounded-2xl rounded-tr-none p-3 max-w-[75%] text-sm">
                <p>Just left a few minor comments on the CSS architecture, but overall solid work!</p>
                <span className="text-[10px] text-primary-foreground/70 mt-1 block text-right">10:36 AM</span>
              </div>
            </div>
            
            <div className="flex gap-3">
              <Avatar className="h-8 w-8">
                <AvatarFallback>RS</AvatarFallback>
              </Avatar>
              <div className="bg-card border rounded-2xl rounded-tl-none p-3 max-w-[75%] text-sm">
                <p>Thanks for the feedback on my assignment! I will review the CSS comments right now.</p>
                <span className="text-[10px] text-muted-foreground mt-1 block">10:42 AM</span>
              </div>
            </div>
          </div>

          <div className="p-4 border-t bg-card">
            <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
              <Input placeholder="Type your message..." className="flex-1" />
              <Button type="submit"><Send className="h-4 w-4" /></Button>
            </form>
          </div>
        </div>
      </Card>
    </>
  )
}


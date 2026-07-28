"use client";

import { PageHeader } from "@/components/shared/PageHeader"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Clock, Video, Users } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { useState } from "react"

export default function SessionsPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [sessionTopic, setSessionTopic] = useState("");
  const [scheduledDate, setScheduledDate] = useState("");

  const handleSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sessionTopic) return;
    setIsDialogOpen(false);
    setSessionTopic("");
    toast.success("Session scheduled successfully!");
  };

  const sessions = [
    {
      id: "1",
      topic: "1-on-1 Code Review & Mentorship",
      students: 1,
      date: "Oct 24, 2023",
      time: "4:00 PM - 4:45 PM",
      status: "Upcoming",
      type: "Mentorship",
    },
    {
      id: "2",
      topic: "Group Q&A: Next.js Performance",
      students: 45,
      date: "Oct 28, 2023",
      time: "2:00 PM - 3:00 PM",
      status: "Upcoming",
      type: "Live Workshop",
    },
  ]

  return (
    <>
      <PageHeader 
        title="Sessions" 
        description="Manage your upcoming live sessions and workshops." 
        action={<Button onClick={() => setIsDialogOpen(true)}><Calendar className="h-4 w-4 mr-2" /> Schedule Session</Button>}
      />

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Schedule Session</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSchedule} className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label>Session Title / Topic *</Label>
              <Input 
                placeholder="e.g. 1-on-1 Portfolio Feedback" 
                value={sessionTopic} 
                onChange={(e) => setSessionTopic(e.target.value)} 
                required 
              />
            </div>
            <div className="space-y-2">
              <Label>Date & Time</Label>
              <Input 
                type="datetime-local" 
                value={scheduledDate} 
                onChange={(e) => setScheduledDate(e.target.value)} 
                required 
              />
            </div>
            <div className="pt-4 flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button type="submit">Schedule Session</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <div className="space-y-6 mt-6">
        <h3 className="text-lg font-medium">Upcoming Schedule</h3>
        <div className="border-l-2 border-primary/20 ml-3 space-y-8 pb-4">
          {sessions.map((session) => (
            <div key={session.id} className="relative pl-8">
              <div className="absolute -left-[11px] top-2 h-5 w-5 rounded-full border-4 border-background bg-primary" />
              <Card>
                <CardHeader className="flex flex-row items-start justify-between pb-2">
                  <div className="space-y-1">
                    <CardTitle className="text-xl">{session.topic}</CardTitle>
                    <div className="flex items-center text-sm text-muted-foreground gap-4">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {session.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {session.time}
                      </span>
                    </div>
                  </div>
                  <Badge variant="secondary">{session.type}</Badge>
                </CardHeader>
                <CardContent className="flex items-center justify-between pt-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span><strong className="font-medium text-foreground">{session.students}</strong> registered students</span>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">Edit Details</Button>
                    <Button size="sm"><Video className="h-4 w-4 mr-2" /> Join Room</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

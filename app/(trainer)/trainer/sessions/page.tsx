"use client";

import { PageHeader } from "@/components/shared/PageHeader"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, Users, Video } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function SessionsPage() {
  const sessions = [
    {
      id: 1,
      date: "Oct 24, 2023",
      time: "10:00 AM - 12:00 PM",
      topic: "React Hooks Deep Dive",
      students: 45,
      status: "Upcoming",
      type: "Live Workshop",
    },
    {
      id: 2,
      date: "Oct 28, 2023",
      time: "2:00 PM - 3:30 PM",
      topic: "Next.js App Router Architecture",
      students: 60,
      status: "Upcoming",
      type: "Q&A Session",
    },
    {
      id: 3,
      date: "Nov 02, 2023",
      time: "11:00 AM - 1:00 PM",
      topic: "State Management with Zustand",
      students: 32,
      status: "Upcoming",
      type: "Live Workshop",
    },
  ]

  return (
    <>
      <PageHeader 
        title="Sessions" 
        description="Manage your upcoming live sessions and workshops." 
        action={<Button><Calendar className="h-4 w-4 mr-2" /> Schedule Session</Button>}
      />

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

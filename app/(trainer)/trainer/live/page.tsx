import { PageHeader } from "@/components/shared/PageHeader"
import { Video, Calendar, Clock, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function LiveClassesPage() {
  const upcomingClasses = [
    {
      id: "1",
      title: "React Fundamentals: Q&A Session",
      course: "Advanced React Patterns",
      date: "Today",
      time: "2:00 PM - 3:30 PM",
      duration: "90 mins",
      attendees: 45,
      status: "Starting Soon",
    },
    {
      id: "2",
      title: "Next.js App Router Deep Dive",
      course: "Next.js Fullstack Development",
      date: "Tomorrow",
      time: "10:00 AM - 11:30 AM",
      duration: "90 mins",
      attendees: 120,
      status: "Scheduled",
    },
    {
      id: "3",
      title: "UI/UX Design Review",
      course: "Modern UI/UX Design",
      date: "Friday, Jul 17",
      time: "4:00 PM - 5:00 PM",
      duration: "60 mins",
      attendees: 32,
      status: "Scheduled",
    }
  ]

  return (
    <>
      <PageHeader 
        title="Live Classes" 
        description="Schedule and manage your live sessions." 
        action={<Button><Video className="w-4 h-4 mr-2" /> Schedule Class</Button>}
      />
      
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {upcomingClasses.map((session) => (
          <Card key={session.id} className="flex flex-col">
            <CardHeader className="pb-4 border-b">
              <div className="flex justify-between items-start gap-4">
                <div>
                  <Badge variant={session.status === "Starting Soon" ? "destructive" : "secondary"} className="mb-3">
                    {session.status}
                  </Badge>
                  <CardTitle className="text-lg leading-tight">{session.title}</CardTitle>
                  <p className="text-sm text-muted-foreground mt-2">{session.course}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="py-4 flex-1 space-y-4 text-sm">
              <div className="flex items-center gap-3">
                <Calendar className="w-4 h-4 text-primary" />
                <span className="font-medium">{session.date}</span>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-primary" />
                <span>{session.time} ({session.duration})</span>
              </div>
              <div className="flex items-center gap-3">
                <Users className="w-4 h-4 text-primary" />
                <span>{session.attendees} Registered Students</span>
              </div>
            </CardContent>
            <CardFooter className="pt-4 border-t">
              <Button className="w-full" variant={session.status === "Starting Soon" ? "default" : "outline"}>
                {session.status === "Starting Soon" ? "Start Meeting" : "Edit Details"}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </>
  )
}

import { PageHeader } from "@/components/shared/PageHeader"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Bell, Users, Clock, MessageSquare } from "lucide-react"

export default function AnnouncementsPage() {
  const recentAnnouncements = [
    {
      id: 1,
      title: "Welcome to Advanced React Patterns!",
      course: "Advanced React",
      date: "2023-10-24T10:00:00Z",
      content: "I'm excited to have you all here. Please make sure to read the syllabus and join our Discord channel.",
      audience: "All Students",
      comments: 12
    },
    {
      id: 2,
      title: "Rescheduling Friday's Live Session",
      course: "Next.js App Router",
      date: "2023-10-20T14:30:00Z",
      content: "Due to unforeseen circumstances, we will move this Friday's session to Saturday at 10 AM EST.",
      audience: "Enrolled Students",
      comments: 5
    }
  ]

  return (
    <>
      <PageHeader 
        title="Announcements" 
        description="Communicate with your students across all your courses." 
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <h3 className="text-xl font-semibold">Recent Announcements</h3>
          <div className="space-y-4">
            {recentAnnouncements.map((announcement) => (
              <Card key={announcement.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{announcement.title}</CardTitle>
                      <CardDescription className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary">{announcement.course}</Badge>
                        <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {new Date(announcement.date).toLocaleDateString()}</span>
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">{announcement.content}</p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1"><Users className="h-4 w-4" /> {announcement.audience}</span>
                    <span className="flex items-center gap-1"><MessageSquare className="h-4 w-4" /> {announcement.comments} Comments</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Create Announcement</CardTitle>
              <CardDescription>Draft a new message to your students.</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div className="space-y-2">
                  <Label>Target Course</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select course..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="react">Advanced React</SelectItem>
                      <SelectItem value="nextjs">Next.js App Router</SelectItem>
                      <SelectItem value="all">All Courses</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Audience</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select audience..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Students</SelectItem>
                      <SelectItem value="active">Active Students</SelectItem>
                      <SelectItem value="completed">Completed Students</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Subject</Label>
                  <Input placeholder="Announcement title" />
                </div>
                <div className="space-y-2">
                  <Label>Message</Label>
                  <Textarea placeholder="Type your message here..." className="min-h-[120px]" />
                </div>
                <Button className="w-full">
                  <Bell className="h-4 w-4 mr-2" />
                  Publish Announcement
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}

"use client";

import React, { useEffect, useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/shared/EmptyState";
import { Bell, Users, Clock, MessageSquare } from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/api";

export default function AnnouncementsPage() {
  const [recentAnnouncements, setRecentAnnouncements] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    setIsLoading(true);
    try {
      const res = await api.get('/notifications').catch(() => null);
      const list = Array.isArray(res?.data) ? res.data : res?.data?.data || [];
      setRecentAnnouncements(list);
    } catch (e) {
      console.warn("Failed to load announcements", e);
      setRecentAnnouncements([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    const newAnn = {
      id: String(Date.now()),
      title: title.trim(),
      course: "General",
      date: new Date().toISOString(),
      content: content.trim(),
      audience: "Enrolled Students",
      comments: 0,
    };

    setRecentAnnouncements([newAnn, ...recentAnnouncements]);
    setTitle("");
    setContent("");
    toast.success("Announcement published!");
  };

  return (
    <>
      <PageHeader
        title="Announcements"
        description="Communicate with your students across all your courses."
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <h3 className="text-xl font-semibold">Recent Announcements</h3>
          {isLoading ? (
            <div className="p-8 text-center text-muted-foreground">Loading announcements...</div>
          ) : recentAnnouncements.length > 0 ? (
            <div className="space-y-4">
              {recentAnnouncements.map((announcement) => (
                <Card key={announcement.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{announcement.title}</CardTitle>
                        <CardDescription className="flex items-center gap-2 mt-1">
                          <Badge variant="secondary">{announcement.course || "Course"}</Badge>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" /> {new Date(announcement.date || announcement.createdAt || Date.now()).toLocaleDateString()}
                          </span>
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">{announcement.content || announcement.message}</p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1"><Users className="h-4 w-4" /> {announcement.audience || "Students"}</span>
                      <span className="flex items-center gap-1"><MessageSquare className="h-4 w-4" /> {announcement.comments || 0} Comments</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={<Bell className="h-10 w-10 text-muted-foreground" />}
              title="No announcements published yet"
              description="Use the form on the right to post your first announcement to students."
            />
          )}
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Create Announcement</CardTitle>
              <CardDescription>Draft a new message to your students.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePublish} className="space-y-4">
                <div className="space-y-2">
                  <Label>Subject *</Label>
                  <Input
                    placeholder="Announcement title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Message *</Label>
                  <Textarea
                    placeholder="Type your message here..."
                    className="min-h-[120px]"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full">
                  <Bell className="h-4 w-4 mr-2" />
                  Publish Announcement
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}

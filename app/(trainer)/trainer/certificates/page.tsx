"use client";

import { PageHeader } from "@/components/shared/PageHeader"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Award, CheckCircle2, Clock, Download, FileSignature } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { useState } from "react"

export default function CertificatesPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [studentEmail, setStudentEmail] = useState("");
  const [courseName, setCourseName] = useState("Full Stack Web Development");

  const handleIssue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentEmail) return;
    setIsDialogOpen(false);
    setStudentEmail("");
    toast.success("Certificate issued successfully!", { description: `Sent to ${studentEmail}` });
  };

  return (
    <>
      <PageHeader 
        title="Certificates" 
        description="Dashboard for Issued Certificates vs Pending Verification."
        action={<Button onClick={() => setIsDialogOpen(true)}><FileSignature className="h-4 w-4 mr-2" /> Issue Certificate manually</Button>}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Issued</CardTitle>
            <Award className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,284</div>
            <p className="text-xs text-muted-foreground mt-1">+12% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending Approval</CardTitle>
            <Clock className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">18</div>
            <p className="text-xs text-muted-foreground mt-1">Requires review</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Auto-Verification Rate</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">98.4%</div>
            <p className="text-xs text-muted-foreground mt-1">Based on quiz pass marks</p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Recent Certificates</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: "Ananya Roy", course: "Advanced React & Next.js", date: "Oct 18, 2023", status: "Issued" },
                { name: "Rohan Gupta", course: "Python Data Science BootCamp", date: "Oct 17, 2023", status: "Issued" },
                { name: "Kavita Singh", course: "UI/UX Design Masterclass", date: "Oct 16, 2023", status: "Pending Verification" },
              ].map((cert, i) => (
                <div key={i} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border rounded-xl gap-4">
                  <div>
                    <h4 className="font-semibold text-sm">{cert.name}</h4>
                    <p className="text-xs text-muted-foreground">{cert.course} • Issued on {cert.date}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                      cert.status === 'Issued' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                    }`}>
                      {cert.status}
                    </span>
                    <Button variant="ghost" size="sm" disabled={cert.status !== 'Issued'}>
                      <Download className="h-4 w-4 mr-2" />
                      PDF
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Issue Certificate Manually</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleIssue} className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label>Student Email *</Label>
              <Input 
                type="email"
                placeholder="student@example.com" 
                value={studentEmail} 
                onChange={(e) => setStudentEmail(e.target.value)} 
                required 
              />
            </div>
            <div className="space-y-2">
              <Label>Course Title</Label>
              <Input 
                value={courseName} 
                onChange={(e) => setCourseName(e.target.value)} 
              />
            </div>
            <div className="pt-4 flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button type="submit">Issue Certificate</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}

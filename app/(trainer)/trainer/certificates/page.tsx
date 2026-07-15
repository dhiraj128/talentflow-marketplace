import { PageHeader } from "@/components/shared/PageHeader"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Award, CheckCircle2, Clock, Download, FileSignature } from "lucide-react"
import { Progress } from "@/components/ui/progress"

export default function CertificatesPage() {
  return (
    <>
      <PageHeader 
        title="Certificates" 
        description="Dashboard for Issued Certificates vs Pending Verification."
        action={<Button><FileSignature className="h-4 w-4 mr-2" /> Issue Certificate manually</Button>}
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
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending Verification</CardTitle>
            <Clock className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">34</div>
            <p className="text-xs text-muted-foreground mt-1">Requires manual review</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Issuance Rate</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">98%</div>
            <Progress value={98} className="mt-2 h-2" />
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <h3 className="text-lg font-medium mb-4">Recent Certificate Activity</h3>
        <Card>
          <CardContent className="p-0">
            <div className="divide-y">
              {[
                { id: 1, student: "Alice Johnson", course: "Advanced React", date: "Oct 24, 2023", status: "Issued" },
                { id: 2, student: "Michael Smith", course: "Next.js Mastery", date: "Oct 23, 2023", status: "Issued" },
                { id: 3, student: "Sarah Williams", course: "UI/UX Fundamentals", date: "Oct 22, 2023", status: "Pending Verification" },
              ].map((cert) => (
                <div key={cert.id} className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Award className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{cert.student}</p>
                      <p className="text-xs text-muted-foreground">{cert.course} • {cert.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
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
    </>
  )
}

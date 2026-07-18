import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Award, Download, ExternalLink } from "lucide-react";
import Link from "next/link";

export function CertificatesWidget() {
  const certificates = [
    {
      id: "cert-1",
      title: "Advanced React Patterns",
      date: "Oct 12, 2026",
      credentialId: "TF-RC-8921",
    },
    {
      id: "cert-2",
      title: "UI/UX Fundamentals",
      date: "Sep 28, 2026",
      credentialId: "TF-UX-3310",
    }
  ];

  return (
    <Card className="flex flex-col h-full border-muted/60">
      <CardHeader className="pb-4 flex flex-row items-center justify-between">
        <CardTitle className="text-xl font-bold flex items-center gap-2">
          <Award className="w-5 h-5 text-amber-500" />
          Recent Certificates
        </CardTitle>
        <Link href="/job-seeker/certificates" className="text-sm text-blue-600 hover:text-blue-800 font-medium">
          View All
        </Link>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col gap-3">
        {certificates.map((cert) => (
          <div key={cert.id} className="flex items-center justify-between p-3 rounded-lg border border-border/50 bg-muted/20 hover:bg-muted/40 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center shrink-0">
                <Award className="w-5 h-5 text-amber-600 dark:text-amber-500" />
              </div>
              <div>
                <h4 className="font-semibold text-sm line-clamp-1">{cert.title}</h4>
                <p className="text-xs text-muted-foreground mt-0.5">Issued: {cert.date}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                <Download className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                <ExternalLink className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

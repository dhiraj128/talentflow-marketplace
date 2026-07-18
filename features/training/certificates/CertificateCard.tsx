import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Award, Share2, Download, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SkillTag } from "../shared/SkillTag";

export interface Certificate {
  id: string;
  courseTitle: string;
  issueDate: string;
  credentialId: string;
  skills: string[];
  thumbnailUrl: string;
}

interface CertificateCardProps {
  certificate: Certificate;
  onPreview?: (cert: Certificate) => void;
  onShare?: (cert: Certificate) => void;
}

export function CertificateCard({ certificate, onPreview, onShare }: CertificateCardProps) {
  return (
    <Card className="flex flex-col overflow-hidden border-border/60 hover:shadow-lg transition-all group">
      <div className="relative aspect-video bg-muted border-b border-border/60 overflow-hidden">
        <img 
          src={certificate.thumbnailUrl} 
          alt={certificate.courseTitle} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute top-3 right-3">
          <Badge className="bg-amber-500 hover:bg-amber-600 text-white shadow-md border-none flex items-center gap-1 px-2.5 py-1">
            <Award className="w-3.5 h-3.5" /> Verified
          </Badge>
        </div>
      </div>
      
      <CardContent className="p-6 flex-1 flex flex-col">
        <h3 className="font-bold text-lg leading-tight mb-2 line-clamp-2">{certificate.courseTitle}</h3>
        
        <div className="text-sm text-muted-foreground space-y-1 mb-4">
          <p>Issued: {certificate.issueDate}</p>
          <p className="font-mono text-xs">ID: {certificate.credentialId}</p>
        </div>
        
        <div className="flex flex-wrap gap-1.5 mb-6">
          {certificate.skills.slice(0, 3).map((skill, idx) => (
            <SkillTag key={idx} skill={skill} />
          ))}
          {certificate.skills.length > 3 && (
            <SkillTag skill={`+${certificate.skills.length - 3}`} />
          )}
        </div>
        
        <div className="mt-auto grid grid-cols-2 gap-2 pt-4 border-t border-border/60">
          <Button variant="outline" size="sm" onClick={() => onPreview && onPreview(certificate)}>
            <ExternalLink className="w-4 h-4 mr-2" /> View
          </Button>
          <Button variant="outline" size="sm" onClick={() => onShare && onShare(certificate)}>
            <Share2 className="w-4 h-4 mr-2" /> Share
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

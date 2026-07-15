import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Clock, DollarSign } from "lucide-react";

export interface JobCardProps {
  title: string;
  company: string;
  location: string;
  type: string; // e.g. Full-time, Contract
  salary: string;
  skills: string[];
}

export function JobCard({ title, company, location, type, salary, skills }: JobCardProps) {
  return (
    <Card className="shadow-sm border group hover:border-primary transition-all">
      <CardContent className="p-6">
        <div className="flex items-start gap-4 mb-4">
          <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0 border bg-muted flex items-center justify-center">
             <span className="text-lg font-bold text-muted-foreground">{company.charAt(0)}</span>
          </div>
          <div className="flex-1">
            <h5 className="text-lg font-bold text-foreground">{title}</h5>
            <p className="text-sm text-muted-foreground font-medium">{company}</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-2 mb-6">
          <div className="flex items-center text-xs text-muted-foreground gap-1.5">
            <MapPin className="h-3.5 w-3.5" /> {location}
          </div>
          <div className="flex items-center text-xs text-muted-foreground gap-1.5">
            <Clock className="h-3.5 w-3.5" /> {type}
          </div>
          <div className="flex items-center text-xs text-muted-foreground gap-1.5 col-span-2">
            <DollarSign className="h-3.5 w-3.5" /> {salary}
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {skills.map((skill: string) => (
            <Badge key={skill} variant="secondary" className="text-[10px] font-medium rounded-sm">
              {skill}
            </Badge>
          ))}
        </div>
        
        <div className="flex gap-3">
          <Button className="flex-1 h-9 rounded-xl">Apply Now</Button>
          <Button variant="outline" className="flex-1 h-9 rounded-xl">Save</Button>
        </div>
      </CardContent>
    </Card>
  );
}

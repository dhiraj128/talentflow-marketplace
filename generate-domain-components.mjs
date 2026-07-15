import fs from 'fs';
import path from 'path';

const COMPONENT_DIR = path.join(process.cwd(), 'components', 'shared');

const templates = {
  'SubscriptionCard.tsx': `"use client";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2 } from "lucide-react";

interface SubscriptionCardProps {
  planName: string;
  price: string;
  billingCycle: string;
  features: string[];
  isActive?: boolean;
  onAction?: () => void;
  actionLabel?: string;
}

export function SubscriptionCard({ planName, price, billingCycle, features, isActive, onAction, actionLabel }: SubscriptionCardProps) {
  return (
    <Card className={isActive ? "border-primary shadow-sm" : ""}>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl">{planName}</CardTitle>
          {isActive && <Badge>Active Plan</Badge>}
        </div>
        <div className="mt-4 flex items-baseline text-3xl font-bold">
          {price}
          <span className="ml-1 text-sm font-medium text-muted-foreground">{billingCycle}</span>
        </div>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3 text-sm">
          {features.map((feature, i) => (
            <li key={i} className="flex gap-x-3">
              <CheckCircle2 className="h-5 w-5 flex-none text-primary" aria-hidden="true" />
              {feature}
            </li>
          ))}
        </ul>
      </CardContent>
      {actionLabel && (
        <CardFooter>
          <Button className="w-full" variant={isActive ? "outline" : "default"} onClick={onAction}>
            {actionLabel}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
`,

  'JobCard.tsx': `"use client";
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Clock, DollarSign, Building } from "lucide-react";

export interface JobCardProps {
  title: string;
  company: string;
  location: string;
  salary: string;
  type: string;
  postedAt: string;
  matchScore?: number;
  onApply?: () => void;
  onSave?: () => void;
}

export function JobCard({ title, company, location, salary, type, postedAt, matchScore, onApply, onSave }: JobCardProps) {
  return (
    <Card className="hover:border-primary/50 transition-colors">
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold text-lg hover:text-primary cursor-pointer">{title}</h3>
            <div className="flex items-center text-muted-foreground mt-1 text-sm gap-2">
              <Building className="w-4 h-4" />
              <span>{company}</span>
            </div>
          </div>
          {matchScore && (
            <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
              {matchScore}% Match
            </Badge>
          )}
        </div>
        <div className="flex flex-wrap gap-4 mt-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {location}</div>
          <div className="flex items-center gap-1"><DollarSign className="w-4 h-4" /> {salary}</div>
          <div className="flex items-center gap-1"><Clock className="w-4 h-4" /> {type}</div>
        </div>
        <div className="flex items-center justify-between mt-6">
          <span className="text-xs text-muted-foreground">Posted {postedAt}</span>
          <div className="flex gap-2">
            {onSave && <Button variant="outline" size="sm" onClick={onSave}>Save</Button>}
            {onApply && <Button size="sm" onClick={onApply}>Apply Now</Button>}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
`,

  'CourseCard.tsx': `"use client";
import React from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, Users, Clock } from "lucide-react";

export interface CourseCardProps {
  title: string;
  instructor: string;
  rating: number;
  enrolled: number;
  duration: string;
  price: string;
  image?: string;
}

export function CourseCard({ title, instructor, rating, enrolled, duration, price, image }: CourseCardProps) {
  return (
    <Card className="overflow-hidden hover:border-primary/50 transition-colors flex flex-col">
      <div className="aspect-video w-full bg-muted relative">
        {image ? (
          <img src={image} alt={title} className="object-cover w-full h-full" />
        ) : (
          <div className="flex items-center justify-center w-full h-full bg-secondary text-secondary-foreground font-semibold">
            Course Preview
          </div>
        )}
      </div>
      <CardContent className="p-4 flex-1">
        <h3 className="font-semibold line-clamp-2 hover:text-primary cursor-pointer">{title}</h3>
        <p className="text-sm text-muted-foreground mt-1">{instructor}</p>
        <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-1 text-amber-500 font-medium">
            <Star className="w-3.5 h-3.5 fill-current" /> {rating}
          </div>
          <div className="flex items-center gap-1">
            <Users className="w-3.5 h-3.5" /> {enrolled}
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" /> {duration}
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between items-center border-t mt-4 border-t-muted pt-4">
        <span className="font-bold text-lg">{price}</span>
        <Button size="sm">Enroll Now</Button>
      </CardFooter>
    </Card>
  );
}
`,

  'ProfileCompletionCard.tsx': `"use client";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";

interface ProfileCompletionCardProps {
  progress: number;
  missingFields: string[];
}

export function ProfileCompletionCard({ progress, missingFields }: ProfileCompletionCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Profile Completion</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between text-sm">
          <span className="font-medium text-muted-foreground">Complete your profile to stand out</span>
          <span className="font-bold">{progress}%</span>
        </div>
        <Progress value={progress} className="h-2" />
        {missingFields.length > 0 && (
          <div className="pt-2">
            <p className="text-xs text-muted-foreground mb-2">Missing information:</p>
            <ul className="text-sm space-y-1">
              {missingFields.map((field, i) => (
                <li key={i} className="flex items-center gap-2 text-amber-600 dark:text-amber-500">
                  <div className="h-1.5 w-1.5 rounded-full bg-current" />
                  {field}
                </li>
              ))}
            </ul>
            <Button variant="outline" size="sm" className="w-full mt-4">Complete Profile</Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
`
};

for (const [filename, content] of Object.entries(templates)) {
  const filePath = path.join(COMPONENT_DIR, filename);
  fs.writeFileSync(filePath, content);
  console.log(`Generated ${filename}`);
}

import { Card, CardContent } from "@/components/ui/card";
import { EnrollButton } from "../shared/EnrollButton";

interface RequirementsCardProps {
  courseId: string;
  price: number;
  requirements: string[];
}

export function RequirementsCard({ courseId, price, requirements }: RequirementsCardProps) {
  return (
    <div className="space-y-6">
      <Card className="border-border/60 overflow-hidden shadow-md">
        <div className="bg-muted p-6 border-b border-border/60 text-center">
          <div className="text-3xl font-bold mb-2">
            {price === 0 ? "Free" : `$${price}`}
          </div>
          <p className="text-sm text-muted-foreground mb-6">30-Day Money-Back Guarantee</p>
          <EnrollButton courseId={courseId} price={price} />
        </div>
        
        <CardContent className="p-6">
          <h4 className="font-bold mb-4">Requirements</h4>
          <ul className="space-y-2.5">
            {requirements.map((req, idx) => (
              <li key={idx} className="flex gap-2 text-sm text-muted-foreground">
                <span className="text-foreground shrink-0">•</span>
                <span className="leading-tight">{req}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}

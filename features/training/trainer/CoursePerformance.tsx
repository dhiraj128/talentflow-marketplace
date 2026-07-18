import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export function CoursePerformance() {
  const courses = [
    { name: "Advanced React Patterns", completionRate: 78, rating: 4.9 },
    { name: "Node.js Microservices", completionRate: 62, rating: 4.7 },
    { name: "Figma UI/UX Fundamentals", completionRate: 85, rating: 4.8 },
  ];

  return (
    <Card className="border-border/60">
      <CardHeader>
        <CardTitle className="text-xl font-bold">Course Performance</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {courses.map((course, i) => (
            <div key={i}>
              <div className="flex justify-between items-end mb-2">
                <div>
                  <h4 className="font-semibold text-sm line-clamp-1">{course.name}</h4>
                  <div className="text-xs text-muted-foreground mt-0.5">Rating: {course.rating} / 5.0</div>
                </div>
                <div className="text-sm font-medium">{course.completionRate}% completion</div>
              </div>
              <Progress value={course.completionRate} className="h-2" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

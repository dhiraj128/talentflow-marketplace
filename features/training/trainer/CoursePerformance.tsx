import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export function CoursePerformance({ data }: { data?: any }) {
  const courses = data?.recentCourses || [];

  return (
    <Card className="border-border/60">
      <CardHeader>
        <CardTitle className="text-xl font-bold">Course Performance</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {courses.length === 0 ? (
            <div className="text-center py-4 text-sm text-muted-foreground">
              Not enough data yet.
            </div>
          ) : (
            courses.slice(0, 3).map((course: any, i: number) => (
              <div key={i}>
                <div className="flex justify-between items-end mb-2">
                  <div>
                    <h4 className="font-semibold text-sm line-clamp-1">{course.title}</h4>
                    <div className="text-xs text-muted-foreground mt-0.5">Rating: {course.rating ?? "N/A"}</div>
                  </div>
                  <div className="text-sm font-medium">{course.completionRate ?? 0}% completion</div>
                </div>
                <Progress value={course.completionRate ?? 0} className="h-2" />
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, MoreHorizontal, Plus } from "lucide-react";
import Link from "next/link";

export function CourseManagement() {
  const courses = [
    { id: 1, title: "Advanced React Patterns", status: "Published", students: 4210, rating: 4.9, revenue: "$15,200" },
    { id: 2, title: "Node.js Microservices", status: "Published", students: 2150, rating: 4.7, revenue: "$8,500" },
    { id: 3, title: "Next.js App Router Masterclass", status: "Draft", students: 0, rating: 0, revenue: "$0" },
  ];

  return (
    <Card className="border-border/60">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <CardTitle className="text-xl font-bold">Course Management</CardTitle>
        <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700">
          <Plus className="w-4 h-4 mr-2" /> Create Course
        </Button>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead>Course</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Students</TableHead>
                <TableHead className="text-right">Revenue</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {courses.map((course) => (
                <TableRow key={course.id}>
                  <TableCell className="font-medium max-w-[200px] truncate">{course.title}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={course.status === 'Published' ? 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400' : 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400'}>
                      {course.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">{course.students.toLocaleString()}</TableCell>
                  <TableCell className="text-right font-medium">{course.revenue}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}

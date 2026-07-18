import { CourseCard } from "../courses/CourseCard";

export function RelatedCourses({ courses }: { courses: any[] }) {
  return (
    <div className="space-y-6 pt-8 border-t border-border/60">
      <h2 className="text-2xl font-bold">More Courses by this Instructor</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
    </div>
  );
}

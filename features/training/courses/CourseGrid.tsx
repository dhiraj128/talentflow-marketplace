import { CourseCard } from "./CourseCard";

interface Course {
  id: string;
  title: string;
  instructor: string;
  rating: number;
  students: number;
  duration: string;
  level: string;
  price: number;
  thumbnail: string;
  isAiRecommended?: boolean;
  skills?: string[];
}

export function CourseGrid({ courses }: { courses: Course[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {courses.map((course) => (
        <CourseCard key={course.id} course={course} />
      ))}
    </div>
  );
}

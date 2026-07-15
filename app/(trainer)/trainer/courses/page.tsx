import { PageHeader } from "@/components/shared/PageHeader"
import { CourseCard } from "@/components/shared/CourseCard"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export default function CoursesPage() {
  const courses = [
    {
      title: "Advanced React Patterns & Architecture",
      instructor: "Jane Doe",
      rating: 4.8,
      enrolled: 450,
      duration: "12h 30m",
      price: "$99",
      image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=600&auto=format&fit=crop"
    },
    {
      title: "Next.js Fullstack Development Masterclass",
      instructor: "Jane Doe",
      rating: 4.9,
      enrolled: 320,
      duration: "15h 15m",
      price: "$129",
      image: "https://images.unsplash.com/photo-1618477388954-7852f32655ec?q=80&w=600&auto=format&fit=crop"
    },
    {
      title: "Modern UI/UX Design for Developers",
      instructor: "Jane Doe",
      rating: 4.7,
      enrolled: 180,
      duration: "8h 45m",
      price: "$79",
      image: "https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?q=80&w=600&auto=format&fit=crop"
    }
  ]

  return (
    <>
      <PageHeader 
        title="My Courses" 
        description="Manage your published courses and create new ones." 
        action={<Button><Plus className="h-4 w-4 mr-2" /> Create Course</Button>}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mt-8">
        {courses.map((course, idx) => (
          <CourseCard key={idx} {...course} />
        ))}
      </div>
    </>
  )
}

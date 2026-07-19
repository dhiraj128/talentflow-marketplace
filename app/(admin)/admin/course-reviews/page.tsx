import { redirect } from "next/navigation";

export default function CourseReviewsRedirect() {
  redirect("/admin/reviews/courses");
}
